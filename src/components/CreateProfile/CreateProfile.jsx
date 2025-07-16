// CreateProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "./FontSize";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import "./CreateProfile.css";
import { FaFont, FaPaperclip, FaItalic, FaUnderline } from "react-icons/fa";
import { MdOutlineFormatBold } from "react-icons/md";
import { PiTextAlignLeftBold, PiTextAlignCenterBold, PiTextAlignRightBold } from "react-icons/pi";
import axios from "axios";

function CreateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [fontSize, setFontSize] = useState("16px");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "ProseMirror tiptap-editor-custom",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    setFontSize(editor.getAttributes("textStyle").fontSize || "16px");
  }, [editor]);

  const handleAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.startsWith("image/")) {
        editor.chain().focus().insertContent({
          type: "image",
          attrs: {
            src: reader.result,
            alt: file.name,
          },
        }).run();
      } else {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        editor.chain().focus().insertContent({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `📎 ${file.name}`,
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: blobUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    download: file.name,
                  },
                },
              ],
            },
          ],
        }).run();
      }
      e.target.value = "";
    };
    file.type.startsWith("image/") ? reader.readAsDataURL(file) : reader.readAsArrayBuffer(file);
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const handleCreateProfile = async () => {
    if (!editor || !name || !email || !title || !location || !employeeId || !editor.getText().trim()) {
      setErrorMessage("Please fill all the required fields.");
      setErrorModalOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("candidate.name", name);
      formData.append("candidate.email", email);
      formData.append("candidate.title", title);
      formData.append("candidate.department", department);
      formData.append("candidate.employee_id", employeeId);
      formData.append("candidate.location", location);
      formData.append("summary_text", editor.getHTML());
      if (profilePicture instanceof File) {
        formData.append("candidate.profile_image", profilePicture);
      }
      await axios.post("http://localhost:8000/profiles/summaries/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile created successfully!");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create profile. Please check your input and try again.");
      setErrorModalOpen(true);
    }
  };

  if (!editor) return null;

  return (
    <div>
      {errorModalOpen && (
        <div className="error-modal">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Input Fields */}
      <h2>Create Profile</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
      <input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onload = () => setProfilePicturePreview(reader.result);
            reader.readAsDataURL(file);
          }
        }}
      />
      {profilePicturePreview && <img src={profilePicturePreview} alt="Preview" width={80} height={80} />}

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}><MdOutlineFormatBold /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}><FaItalic /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}><FaUnderline /></button>
        <select value={fontSize} onChange={handleFontSizeChange}>
          <option value="12px">12</option>
          <option value="16px">16</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
        </select>
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}><PiTextAlignLeftBold /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}><PiTextAlignCenterBold /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}><PiTextAlignRightBold /></button>
        <button onClick={() => fileInputRef.current?.click()}><FaPaperclip /></button>
        <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleAttachment} />
      </div>

      <EditorContent editor={editor} />

      <button onClick={handleCreateProfile}>Submit</button>
    </div>
  );
}

export default CreateProfile;