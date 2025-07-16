import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "tiptap-extension-font-size";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import "./CreateProfile.css";
import { FaFont, FaPaperclip } from "react-icons/fa";
import { MdOutlineFormatBold } from "react-icons/md";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { PiTextAlignLeftBold } from "react-icons/pi";
import { PiTextAlignCenterBold } from "react-icons/pi";
import { PiTextAlignRightBold } from "react-icons/pi";
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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const fileInputRef = useRef(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
 
  function flattenErrors(data, fieldMap = {}, parentKey = "") {
    let messages = [];
    for (const [key, value] of Object.entries(data)) {
      const displayKey = fieldMap[key] || key.replace("candidate.", "");
      if (Array.isArray(value)) {
        messages.push(`${displayKey}: ${value.join(", ")}`);
      } else if (typeof value === "object" && value !== null) {
        messages = messages.concat(flattenErrors(value, fieldMap, key));
      } else {
        messages.push(`${displayKey}: ${value}`);
      }
    }
    return messages;
  }
 
  function getFriendlyErrorMessage(error) {
    if (!error.response) {
      return "Could not connect to the server. Please check your internet connection or try again later.";
    }
    if (error.response.status === 400) {
      const data = error.response.data;
      if (typeof data === "object") {
        const requiredFields = [
          "candidate.name",
          "candidate.title",
          "candidate.location",
          "candidate.employee_id",
          "candidate.email",
          "summary_text",
        ];
        const missing = requiredFields.filter((field) => data[field]);
        if (missing.length > 0) {
          return "Please fill all the required fields.";
        }
        if (data["candidate.email"]) {
          const emailError = Array.isArray(data["candidate.email"])
            ? data["candidate.email"].join(" ").toLowerCase()
            : String(data["candidate.email"]).toLowerCase();
          if (
            emailError.includes("valid email") ||
            emailError.includes("valid e-mail") ||
            emailError.includes("valid e mail") ||
            emailError.includes("enter a valid")
          ) {
            return "Please enter a valid email address.";
          }
        }
        const fieldMap = {
          "candidate.name": "Name",
          "candidate.title": "Title",
          "candidate.location": "Location",
          "candidate.employee_id": "Employee ID",
          "candidate.email": "Email",
          "candidate.profile_image": "Profile Picture",
          summary_text: "Profile Summary",
        };
        return flattenErrors(data, fieldMap).join("\n");
      }
      return "There was a problem with your submission. Please check your input.";
    }
    if (error.response.status === 404) {
      return "The requested resource was not found. Please contact support.";
    }
    if (error.response.status === 500) {
      return "A server error occurred. Please try again later.";
    }
    return "An unknown error occurred. Please try again.";
  }
 
  const handleCreateProfile = async () => {
    if (!editor) return;
    if (
      !name ||
      !email ||
      !title ||
      !location ||
      !employeeId ||
      !editor.getText().trim()
    ) {
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
      const response = await axios.post(
        "http://localhost:8000/profiles/summaries/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile created successfully!");
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
      setErrorModalOpen(true);
    }
  };
 
  if (!editor) return null;
 
  return (
    <div>
      {errorModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 20,
              minWidth: 320,
              maxWidth: 480,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "#c00", marginTop: 0 }}>Error</h2>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "#333",
                fontSize: 16,
                fontFamily: "Ubuntu",
              }}
            >
              {errorMessage}
            </pre>
            <button
              style={{
                marginTop: 16,
                padding: "8px 24px",
                borderRadius: 15,
                background: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "Ubuntu",
              }}
              onClick={() => setErrorModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h2 className="profile-creation-title">Create Profile</h2>
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
          {/* <div className="profile-fields">
            <label className="fields-label" htmlFor="Department">
              Department
            </label>
            <input
              type="text"
              className="fields-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div> */}
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
        <div className="fields-wrapper2">
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
                  setProfilePicture(file); // store the File object
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfilePicturePreview(reader.result); // store the preview
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
            {profilePicturePreview && (
              <img
                src={profilePicturePreview}
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
        <p>Ensure all fields are correctly filled before submission.</p>
        <button
          type="button"
          className="create-profile-btn"
          onClick={handleCreateProfile}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
 
export default CreateProfile;