import { useState, useEffect, useRef } from "react";
import LikeIcon from "../kepek/feketeKomment.svg";
import "../style/style.css";
import { deleteBejegyzes, BASE } from "../api";

export default function PostCard({
  bejegyzes_id,
  profilkep,
  felhasznalonev,
  feltoltotkep,
  szoveg,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTartalom, setEditTartalom] = useState("");
  const [showFullText, setShowFullText] = useState(false);

  const menuRef = useRef(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      felhasznalo: "Eleanor Pena",
      szoveg: "Szia! Ez egy teszt komment.",
      ido: "2025.10.09 17:40",
    },
  ]);

  const MAX_TEXT_LENGTH = 90;
  const isLongText = szoveg && szoveg.length > MAX_TEXT_LENGTH;

  const displayedText =
    isLongText && !showFullText
      ? szoveg.slice(0, MAX_TEXT_LENGTH) + "..."
      : szoveg;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSendComment() {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${BASE}/komment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tartalom: newComment,
          bejegyzes_id: bejegyzes_id,
        }),
      });

      const data = await res.json();

      if (data.result) {
        setComments((prev) => [
          ...prev,
          {
            id: Date.now(),
            felhasznalo: "Én",
            szoveg: newComment,
            ido: new Date().toLocaleString("hu-HU"),
          },
        ]);
      }

      setNewComment("");
    } catch (error) {
      alert(`Szerverhiba: ${error.message}`);
    }
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-white">
      <div
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "30px",
          background: "#242424",
          boxShadow: "0 14px 38px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "24px",
        }}
      >
        {/* MENU */}
        <div
          className="position-absolute"
          style={{ top: "18px", right: "22px" }}
          ref={menuRef}
        >
          <button
            className="btn text-white border-0"
            type="button"
            style={{
              fontSize: "22px",
              background: "transparent",
              lineHeight: "1",
            }}
            onClick={() => setShowMenu(!showMenu)}
          >
            &#8942;
          </button>

          {showMenu && (
            <div
              className="bg-dark border border-secondary rounded-4 p-2 shadow"
              style={{
                position: "absolute",
                right: 0,
                zIndex: 1000,
                minWidth: "140px",
              }}
            >
              <div
                className="p-2 border-bottom border-secondary text-white"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowMenu(false);
                  setEditTartalom(szoveg || "");
                  setIsEditOpen(true);
                }}
              >
                <small>Szerkesztés</small>
              </div>

              <div
                className="p-2 text-danger"
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  setShowMenu(false);
                  const res = await deleteBejegyzes(bejegyzes_id);
                  alert(res.message);
                  window.location.reload();
                }}
              >
                <small>Törlés</small>
              </div>
            </div>
          )}
        </div>

        {/* FEJLÉC */}
        <div className="d-flex flex-row align-items-center mb-3 pe-5">
          <img
            style={{
              width: "46px",
              height: "46px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.18)",
            }}
            src={profilkep}
            alt="profilkep"
          />

          <div className="ms-2">
            <div style={{ fontSize: "19px", fontWeight: "bold" }}>
              {felhasznalonev}
            </div>
          </div>
        </div>

        {/* SZÖVEG */}
        {szoveg && (
          <div
            className="mb-3"
            style={{
              background: "#303030",
              borderRadius: "18px",
              padding: "15px 17px",
              fontSize: "16px",
              lineHeight: "1.45",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              whiteSpace: "pre-wrap",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {displayedText}

            {isLongText && (
              <button
                className="btn p-0 ms-1"
                style={{
                  color: "#ff7a18",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText
                  ? "Kevesebb megjelenítés"
                  : "Több megjelenítés"}
              </button>
            )}
          </div>
        )}

        {/* KÉP */}
        {feltoltotkep && (
          <div
            className="mb-3"
            style={{
              width: "100%",
              borderRadius: "22px",
              overflow: "hidden",
              background: "#1d1d1d",
            }}
          >
            <img
              src={`${BASE}/uploads/${feltoltotkep}`}
              alt="poszt"
              style={{
                width: "100%",
                maxHeight: "520px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* ALSÓ RÉSZ */}
        <div
          className="d-flex justify-content-between align-items-center pt-2"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="d-flex gap-2">
            <img src={LikeIcon} alt="komment" style={{ width: "23px" }} />
            <img src={LikeIcon} alt="komment" style={{ width: "23px" }} />
            <img src={LikeIcon} alt="komment" style={{ width: "23px" }} />
          </div>

          <button
            className="btn btn-sm text-white px-3"
            style={{
              background: "#333333",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Kommentek
          </button>
        </div>
      </div>

      {/* SZERKESZTÉS MODAL */}
      {isEditOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="bg-dark border border-secondary p-4 rounded-5 shadow-lg text-white"
            style={{ width: "95%", maxWidth: "650px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="m-0">Bejegyzés szerkesztése</h4>

              <button
                className="btn text-white"
                onClick={() => setIsEditOpen(false)}
              >
                ✕
              </button>
            </div>

            {feltoltotkep && (
              <img
                src={`${BASE}/uploads/${feltoltotkep}`}
                alt="poszt"
                className="img-fluid rounded mb-3"
                style={{
                  maxHeight: "250px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            <textarea
              className="form-control bg-dark text-white border-secondary shadow-none p-3"
              placeholder="Írd át a bejegyzést..."
              value={editTartalom}
              onChange={(e) => setEditTartalom(e.target.value)}
              style={{
                minHeight: "220px",
                resize: "none",
                borderRadius: "15px",
              }}
            />

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn btn-outline-light px-4"
                style={{ borderRadius: "12px" }}
                onClick={() => setIsEditOpen(false)}
              >
                Mégse
              </button>

              <button
                className="btn csetliColor px-4 border-0"
                style={{ borderRadius: "12px" }}
                onClick={() => {
                  console.log("Szerkesztett szöveg:", editTartalom);
                  setIsEditOpen(false);
                }}
              >
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KOMMENT MODAL */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.82)",
            zIndex: 9999,
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="position-relative shadow-lg"
            style={{
              width: "92%",
              maxWidth: "950px",
              height: "82vh",
              background: "#242424",
              borderRadius: "26px",
              color: "white",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn position-absolute text-white"
              style={{
                top: "12px",
                right: "16px",
                zIndex: 10,
                fontSize: "26px",
              }}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="d-flex h-100 flex-column flex-md-row">
              <div
                className="col-md-6 p-4 d-flex flex-column"
                style={{
                  background: "#2b2b2b",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="d-flex align-items-center mb-3 pe-5">
                  <img
                    src={profilkep}
                    alt="profilkep"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  <b className="ms-2">{felhasznalonev}</b>
                </div>

                <div className="flex-grow-1 overflow-auto pe-1">
                  {szoveg && (
                    <div
                      className="mb-3"
                      style={{
                        background: "#353535",
                        borderRadius: "16px",
                        padding: "14px",
                        fontSize: "15px",
                        lineHeight: "1.45",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {szoveg}
                    </div>
                  )}

                  {feltoltotkep && (
                    <img
                      src={`${BASE}/uploads/${feltoltotkep}`}
                      className="img-fluid"
                      style={{
                        maxHeight: "390px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "18px",
                      }}
                      alt="poszt"
                    />
                  )}
                </div>
              </div>

              <div className="col-md-6 p-4 d-flex flex-column">
                <div className="mb-3">
                  <h4 className="m-0 fw-bold">Kommentek</h4>
                  <small style={{ color: "#bdbdbd" }}>
                    Itt tudod megnézni és hozzáadni a hozzászólásokat.
                  </small>
                </div>

                <div className="flex-grow-1 overflow-auto pe-2">
                  {comments.length === 0 ? (
                    <div
                      className="h-100 d-flex justify-content-center align-items-center text-center"
                      style={{ color: "#bdbdbd" }}
                    >
                      Még nincs komment. Legyél te az első.
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="mb-3"
                        style={{
                          background: "#303030",
                          borderRadius: "16px",
                          padding: "12px 14px",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <b style={{ fontSize: "14px" }}>{c.felhasznalo}</b>
                          <small style={{ color: "#a8a8a8", fontSize: "11px" }}>
                            {c.ido}
                          </small>
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#f1f1f1",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {c.szoveg}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  className="mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(250, 245, 245, 0.99)" }}
                >
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control text-white shadow-none"
                      placeholder="Írj egy kommentet..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendComment();
                      }}
                      style={{
                        background: "#303030",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "999px",
                        padding: "10px 16px",
                        color: "fafafa"
                      }}
                    />

                    <button
                      onClick={handleSendComment}
                      className="btn csetliColor px-4 border-0"
                      style={{
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Küldés
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}