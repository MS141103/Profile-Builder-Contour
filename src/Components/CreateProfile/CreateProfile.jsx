import React, { useState, useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
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

function CreateProfile() {
  const [fontSize, setFontSize] = useState("16px");
  const fileInputRef = useRef(null);
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
  if (!editor) return null;

  return (
    <div>
      <h2 className="profile-creation-title">Create Profile</h2>
      <div className="fields-container">
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Name
            </label>
            <input type="text" className="fields-input" />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Email
            </label>
            <input type="text" className="fields-input" />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Title
            </label>
            <input type="text" className="fields-input" />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Department
            </label>
            <input type="text" className="fields-input" />
          </div>
        </div>
        <div className="fields-wrapper">
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Employee ID
            </label>
            <input type="text" className="fields-input" />
          </div>
          <div className="profile-fields">
            <label className="fields-label" htmlFor="Name">
              Location
            </label>
            <input type="text" className="fields-input" />
          </div>
        </div>
        <div className="profile-fields">
          <label className="fields-label" htmlFor="Name">
            Add Profile Picture
          </label>
          <div className="pfp-input">
            <button className="add-pfp">Add Profile Picture</button>
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
    </div>
  );
}

export default CreateProfile;
