import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import FontSize from "./FontSize"; // Ensure you have FontSize.js with a proper export
import "./UpdateProfile.css";

import { FaFont, FaPaperclip, FaItalic, FaUnderline } from "react-icons/fa";
import { MdOutlineFormatBold } from "react-icons/md";
import {
  PiTextAlignLeftBold,
  PiTextAlignCenterBold,
  PiTextAlignRightBold,
} from "react-icons/pi";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [fontSize, setFontSize] = useState("16px");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { id } = useParams();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "tiptap-attachment-image" },
      }),
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
    async function fetchProfileById() {
      try {
        const response = await axios.get(
          `http://localhost:8000/profiles/summaries/${id}/`
        );
        const profile = response.data;
        setName(profile.candidate.name || "");
        setEmail(profile.candidate.email || "");
        setTitle(profile.candidate.title || "");
        setDepartment(profile.candidate.department || "");
        setEmployeeId(profile.candidate.employee_id || "");
        setLocation(profile.candidate.location || "");
        setProfilePicture(null);
        setProfilePicturePreview(profile.candidate.profile_image || null);
        if (editor && profile.summary_text) {
          editor.commands.setContent(profile.summary_text, "html");
        }
      } catch (err) {
        setFetchError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    }
    if (editor && id) fetchProfileById();
  }, [editor, id]);

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
        editor
          .chain()
          .focus()
          .insertContent({ type: "image", attrs: { src: reader.result } })
          .run();
      } else {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        editor
          .chain()
          .focus()
          .insertContent({
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
                    },
                  },
                ],
              },
            ],
          })
          .run();
      }
    };
    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const handleUpdateProfile = async () => {
    if (!id) {
      alert("No valid profile to update.");
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
      await axios.patch(
        `http://localhost:8000/profiles/summaries/${id}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  if (!editor) return null;
  return (
    <div className="update-profile-container">
      {/* Your form structure and JSX stays here */}
      {/* For brevity, only editor and update button shown */}

      <EditorContent editor={editor} className="editor" />
      <select value={fontSize} onChange={handleFontSizeChange}>
        <option value="12px">12</option>
        <option value="16px">16</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
      </select>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleAttachment}
      />
      <button onClick={() => fileInputRef.current.click()}>Attach File</button>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
}

export default UpdateProfile;