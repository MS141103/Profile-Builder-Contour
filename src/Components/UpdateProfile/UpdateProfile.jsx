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
import "./UpdateProfile.css";
import { FaFont, FaPaperclip, FaEdit } from "react-icons/fa";
import { MdOutlineFormatBold } from "react-icons/md";
import { FaItalic, FaUnderline } from "react-icons/fa";
import {
  PiTextAlignLeftBold,
  PiTextAlignCenterBold,
  PiTextAlignRightBold,
} from "react-icons/pi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function UpdateProfile() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    title: "",
    department: "",
    employeeId: "",
    location: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    title: false,
    department: false,
    employeeId: false,
    location: false,
    editor: false,
    profilePicture: false,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [fontSize, setFontSize] = useState("16px");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { id } = useParams();
  const [originalFields, setOriginalFields] = useState(null);
  const [originalSummary, setOriginalSummary] = useState("");
  const [originalProfilePicture, setOriginalProfilePicture] = useState(null);

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
    editable: false,
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

        const loadedFields = {
          name: profile.candidate?.name || "",
          email: profile.candidate?.email || "",
          title: profile.candidate?.title || "",
          department: profile.candidate?.department || "",
          employeeId: profile.candidate?.employee_id || "",
          location: profile.candidate?.location || "",
        };
        setFields(loadedFields);
        setOriginalFields(loadedFields);
        setOriginalSummary(profile.summary_text || "");
        setProfilePicturePreview(profile.candidate?.profile_image || null);
        setOriginalProfilePicture(profile.candidate?.profile_image || null);

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

  useEffect(() => {
    if (editor) {
      editor.setEditable(editMode.editor);
    }
  }, [editor, editMode.editor]);

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

  const handleFieldChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    if (field === "editor" && editor) {
      editor.setEditable(!editMode.editor);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const navigate = useNavigate();
  const handleUpdateProfile = async () => {
    setErrorMsg("");
    if (!id) {
      setErrorMsg("No valid profile to update.");
      return;
    }

    let changedCandidate = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== originalFields[key]) {
        if (key === "employeeId") {
          changedCandidate["employee_id"] = fields[key];
        } else {
          changedCandidate[key] = fields[key];
        }
      }
    });

    const summaryText = editor.getHTML();
    const summaryChanged = summaryText !== originalSummary;
    const profilePicChanged = profilePicture instanceof File;

    if (
      Object.keys(changedCandidate).length === 0 &&
      !summaryChanged &&
      !profilePicChanged
    ) {
      setErrorMsg("No changes to update.");
      return;
    }

    try {
      if (profilePicChanged) {
        // Use FormData for file upload
        const formData = new FormData();
        Object.entries(changedCandidate).forEach(([key, value]) => {
          formData.append(`candidate.${key}`, value);
        });
        if (summaryChanged) {
          formData.append("summary_text", summaryText);
        }
        formData.append("candidate.profile_image", profilePicture);
        await axios.patch(
          `http://localhost:8000/profiles/summaries/${id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Use JSON for non-file updates
        let payload = {};
        if (Object.keys(changedCandidate).length > 0) {
          payload.candidate = changedCandidate;
        }
        if (summaryChanged) {
          payload.summary_text = summaryText;
        }
        await axios.patch(
          `http://localhost:8000/profiles/summaries/${id}/`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      }
      alert("Profile updated successfully!");
      navigate(`/display-profile/${id}`); 
      setOriginalFields({ ...fields });
      setOriginalSummary(summaryText);
      setProfilePicture(null);
      setOriginalProfilePicture(profilePicturePreview);
      setEditMode({
        name: false,
        email: false,
        title: false,
        department: false,
        employeeId: false,
        location: false,
        editor: false,
        profilePicture: false,
      });
      if (editor) editor.setEditable(false);
    } catch (err) {
      const data = err.response?.data;
      if (data?.candidate?.email?.[0]) {
        setErrorMsg(data.candidate.email[0]);
      } else if (typeof data === "string") {
        setErrorMsg(data);
      } else {
        setErrorMsg("Failed to update profile.");
      }
    }
  };

  if (!editor) return null;

  return (
    <div>
      <h2 className="profile-creation-title">Update Profile</h2>
      {errorMsg && (
        <div style={{ color: "red", marginBottom: 10, fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}
      <div className="fields-container">
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Name
              <FaEdit
                className="edit-icon"
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => handleEditToggle("name")}
                title={editMode.name ? "Lock" : "Edit"}
              />
            </label>
            <input
              type="text"
              className="fields-input"
              value={fields.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              readOnly={!editMode.name}
              style={{ color: editMode.name ? "#000000" : "#777" }}
            />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Email">
              Email
              <FaEdit
                className="edit-icon"
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => handleEditToggle("email")}
                title={editMode.email ? "Lock" : "Edit"}
              />
            </label>
            <input
              type="text"
              className="fields-input"
              value={fields.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              readOnly={!editMode.email}
              style={{ color: editMode.email ? "#000000" : "#777" }}
            />
          </div>
        </div>
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Title">
              Title
              <FaEdit
                className="edit-icon"
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => handleEditToggle("title")}
                title={editMode.title ? "Lock" : "Edit"}
              />
            </label>
            <input
              type="text"
              className="fields-input"
              value={fields.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              readOnly={!editMode.title}
              style={{ color: editMode.title ? "#000000" : "#777" }}
            />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Location">
              Location
              <FaEdit
                className="edit-icon"
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => handleEditToggle("location")}
                title={editMode.location ? "Lock" : "Edit"}
              />
            </label>
            <input
              type="text"
              className="fields-input"
              value={fields.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              readOnly={!editMode.location}
              style={{ color: editMode.location ? "#000000" : "#777" }}
            />
          </div>
        </div>
        <div className="fields-wrapper2">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="EmployeeID">
              Employee ID
              <FaEdit
                className="edit-icon"
                style={{ marginLeft: 8, cursor: "pointer" }}
                onClick={() => handleEditToggle("employeeId")}
                title={editMode.employeeId ? "Lock" : "Edit"}
              />
            </label>
            <input
              type="text"
              className="fields-input"
              value={fields.employeeId}
              onChange={(e) => handleFieldChange("employeeId", e.target.value)}
              readOnly={!editMode.employeeId}
              style={{ color: editMode.employeeId ? "#000000" : "#777" }}
            />
          </div>
        </div>
        <div className="profile-fields">
          <label
            className="fields-label"
            htmlFor="ProfilePicture"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Add Profile Picture
            <FaEdit
              className="edit-icon"
              style={{ marginLeft: 8, cursor: "pointer" }}
              onClick={() => handleEditToggle("profilePicture")}
              title={editMode.profilePicture ? "Lock" : "Edit"}
            />
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
              onChange={handleProfilePictureChange}
              disabled={!editMode.profilePicture}
            />
            {!profilePicturePreview && (
              <button
                className="add-pfp"
                type="button"
                onClick={() =>
                  editMode.profilePicture &&
                  document.getElementById("profile-picture-input").click()
                }
                style={{ margin: 0 }}
                disabled={!editMode.profilePicture}
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
                onClick={() =>
                  editMode.profilePicture &&
                  document.getElementById("profile-picture-input").click()
                }
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: 0,
                  objectFit: "cover",
                  display: "block",
                  cursor: editMode.profilePicture ? "pointer" : "default",
                  opacity: editMode.profilePicture ? 1 : 0.7,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="editor-container">
        <div className="editor" style={{ position: "relative" }}>
          <div className="toolbar">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
              type="button"
              disabled={!editMode.editor}
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
              disabled={!editMode.editor}
            >
              <FaItalic className="toolbar-btns" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "active" : ""}
              type="button"
              disabled={!editMode.editor}
            >
              <FaUnderline className="toolbar-btns" />
            </button>
            <select
              value={fontSize}
              onChange={handleFontSizeChange}
              className="fontsize-option"
              disabled={!editMode.editor}
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
                if (!editMode.editor) return;
                const colorInput =
                  document.getElementById("color-picker-input");
                if (colorInput) colorInput.click();
              }}
              style={{ opacity: editMode.editor ? 1 : 0.5 }}
            >
              <button
                type="button"
                title="Text Color"
                aria-label="Text Color"
                style={{
                  background: "none",
                  border: "none",
                  cursor: editMode.editor ? "pointer" : "not-allowed",
                  padding: 0,
                  marginLeft: 0,
                  marginBottom: "-10px",
                  marginTop: "-1.5px",
                  fontSize: 15,
                }}
                disabled={!editMode.editor}
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
                disabled={!editMode.editor}
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
              disabled={!editMode.editor}
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
              disabled={!editMode.editor}
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
              disabled={!editMode.editor}
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
                editMode.editor &&
                fileInputRef.current &&
                fileInputRef.current.click()
              }
              title="Insert Attachment"
              disabled={!editMode.editor}
            >
              <FaPaperclip style={{ fontSize: 18 }} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAttachment}
              disabled={!editMode.editor}
            />
          </div>
          <FaEdit
            className="edit-icon"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 2,
              color: editMode.editor ? "#007bff" : "#888",
            }}
            onClick={() => handleEditToggle("editor")}
            title={editMode.editor ? "Lock" : "Edit"}
          />
          <EditorContent
            editor={editor}
            className="editor"
            style={{
              color: editMode.editor ? "#222" : "#888",
            }}
          />
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
