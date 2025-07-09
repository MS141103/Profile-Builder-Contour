import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "tiptap-extension-font-size";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import "./UpdateProfile.css";
import { FaFont, FaPaperclip } from "react-icons/fa";
import { MdOutlineFormatBold } from "react-icons/md";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { PiTextAlignLeftBold } from "react-icons/pi";
import { PiTextAlignCenterBold } from "react-icons/pi";
import { PiTextAlignRightBold } from "react-icons/pi";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [fontSize, setFontSize] = useState("16px");
  const fileInputRef = useRef(null);

  // Editor instance
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
    content: "", // Will be set after loading from localStorage
    editorProps: {
      attributes: {
        class: "ProseMirror tiptap-editor-custom",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const saved = localStorage.getItem("profileFormData");
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setEmail(data.email || "");
      setTitle(data.title || "");
      setDepartment(data.department || "");
      setEmployeeId(data.employeeId || "");
      setLocation(data.location || "");
      setProfilePicture(data.profilePicture || null);
      if (data.editorContent) {
        editor.commands.setContent(data.editorContent);
      }
    }
  }, [editor]);

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
          .insertContent([
            {
              type: "image",
              attrs: {
                src: reader.result,
                alt: file.name,
                title: file.name,
                class: "tiptap-attachment-image",
              },
            },
            { type: "paragraph" },
          ])
          .run();
      } else {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        editor
          .chain()
          .focus()
          .insertContent([
            {
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
                        class: "tiptap-attachment-link",
                        title: file.name,
                        download: file.name,
                        "data-filesaver-blob": "true",
                      },
                    },
                  ],
                },
              ],
            },
          ])
          .run();
      }
      e.target.value = "";
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

  useEffect(() => {
    if (!editor) return;
    const handler = (e) => {
      const a = e.target.closest("a");
      if (a && a.href) {
        e.preventDefault();
      }
    };
    const pm = document.querySelector(".editor .ProseMirror");
    if (pm) pm.addEventListener("click", handler);
    return () => {
      if (pm) pm.removeEventListener("click", handler);
    };
  }, [editor]);

  const handleUpdateProfile = async () => {
    if (!editor) return;
    const data = {
      name,
      email,
      title,
      department,
      employeeId,
      location,
      profilePicture,
      editorContent: editor.getJSON(),
    };
    localStorage.setItem("profileFormData", JSON.stringify(data));
    alert("Profile updated in localStorage!");
  };

  if (!editor) return null;

  return (
    <div>
      <h2 className="profile-creation-title">Update Profile</h2>
      <div className="fields-container">
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Name
            </label>
            <input
              type="text"
              className="fields-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Email">
              Email
            </label>
            <input
              type="text"
              className="fields-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Title">
              Title
            </label>
            <input
              type="text"
              className="fields-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Department">
              Department
            </label>
            <input
              type="text"
              className="fields-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
        </div>
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="EmployeeID">
              Employee ID
            </label>
            <input
              type="text"
              className="fields-input"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Location">
              Location
            </label>
            <input
              type="text"
              className="fields-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="profile-fields">
          <label className="fields-label" htmlFor="ProfilePicture">
            Add Profile Picture
          </label>
          <div
            className="pfp-input pfpinput-2"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 60,
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-picture-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfilePicture(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {!profilePicture && (
              <button
                className="add-pfp"
                type="button"
                onClick={() =>
                  document.getElementById("profile-picture-input").click()
                }
                style={{ margin: 0 }}
              >
                Add Profile Picture
              </button>
            )}
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile Preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: 0,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="editor-container">
        <div className="editor">
          <div className="toolbar">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
              type="button"
            >
              <MdOutlineFormatBold
                className="toolbar-btns"
                style={{ fontSize: 20, padding: 0.5 }}
              />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "active" : ""}
              type="button"
            >
              <FaItalic className="toolbar-btns" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "active" : ""}
              type="button"
            >
              <FaUnderline className="toolbar-btns" />
            </button>
            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="fontsize-option"
            >
              <option value="12px">12</option>
              <option value="16px">16</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="30px">30</option>
            </select>
            <div
              className="font-color"
              onClick={() => {
                const colorInput =
                  document.getElementById("color-picker-input");
                if (colorInput) colorInput.click();
              }}
            >
              <button
                type="button"
                title="Text Color"
                aria-label="Text Color"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginLeft: 0,
                  marginBottom: "-10px",
                  marginTop: "-1.5px",
                  fontSize: 15,
                }}
              >
                <FaFont />
              </button>
              <input
                id="color-picker-input"
                type="color"
                style={{ display: "none" }}
                onChange={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
              />
              <div style={{ marginTop: 0, marginBottom: "-8px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 4,
                    background:
                      editor.getAttributes("textStyle").color || "#000",
                    border: "none",
                    borderRadius: 3,
                    verticalAlign: "middle",
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              type="button"
              className={editor.isActive({ textAlign: "left" }) ? "active" : ""}
            >
              <PiTextAlignLeftBold
                className="toolbar-btns"
                style={{ fontSize: 19.5, padding: 1 }}
              />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              type="button"
              className={
                editor.isActive({ textAlign: "center" }) ? "active" : ""
              }
            >
              <PiTextAlignCenterBold
                className="toolbar-btns"
                style={{ fontSize: 19.5, padding: 1 }}
              />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              type="button"
              className={
                editor.isActive({ textAlign: "right" }) ? "active" : ""
              }
            >
              <PiTextAlignRightBold
                className="toolbar-btns"
                style={{ fontSize: 19.5, padding: 1 }}
              />
            </button>
            <button
              type="button"
              className="attachment-btn"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              title="Insert Attachment"
            >
              <FaPaperclip style={{ fontSize: 18 }} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAttachment}
            />
          </div>
          <EditorContent editor={editor} className="editor" />
        </div>
      </div>
      <div className="profile-footer">
        <p>Update your profile and click the button below to save changes.</p>
        <button
          type="button"
          className="create-profile-btn"
          onClick={handleUpdateProfile}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;
