import { useState, useEffect, useRef } from "react";
import "../style/style.css";
import { deleteBejegyzes, BASE, getKommentek } from "../api";

export default function PostCard({
  bejegyzes_id,
  profilkep,
  felhasznalonev,
  feltoltotkep,
  szoveg,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const menuRef = useRef(null);

  const MAX_TEXT_LENGTH = 140;
  const isLongText = szoveg && szoveg.length > MAX_TEXT_LENGTH;

  const displayedText =
    isLongText && !showFullText
      ? szoveg.slice(0, MAX_TEXT_LENGTH) + "..."
      : szoveg;

  useEffect(() => {
    async function loadComments() {
      if (!isModalOpen) return;

      const res = await getKommentek(bejegyzes_id);

      if (res.result) {
        setComments(res.comments);
      } else {
        alert("Nem tudtuk betölteni a kommenteket: " + res.message);
      }
    }

    loadComments();
  }, [isModalOpen, bejegyzes_id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const interval = setInterval(async () => {
      const res = await getKommentek(bejegyzes_id);
      if (res.result) setComments(res.comments);
    }, 5000);

    return () => clearInterval(interval);
  }, [isModalOpen, bejegyzes_id]);

  function handleLike() {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  }

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
        setNewComment("");

        const updatedComments = await getKommentek(bejegyzes_id);

        if (updatedComments.result) {
          setComments(updatedComments.comments);
        }
      } else {
        alert(data.message || "Nem sikerült elküldeni a kommentet.");
      }
    } catch (error) {
      alert(`Szerverhiba: ${error.message}`);
    }
  }

  const ActionButton = ({ icon, label, count, active, onClick }) => (
    <button
      className="btn d-flex align-items-center gap-2 px-3 py-2"
      style={{
        background: active ? "rgba(255, 55, 35, 0.18)" : "#303030",
        color: active ? "#ff4b3a" : "#e6e6e6",
        borderRadius: "999px",
        border: active
          ? "1px solid rgba(255, 75, 58, 0.45)"
          : "1px solid rgba(255,255,255,0.08)",
        fontWeight: "bold",
        fontSize: "14px",
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: "17px" }}>{icon}</span>
      <span>{label}</span>
      <span style={{ color: active ? "#ffb0a8" : "#bdbdbd" }}>{count}</span>
    </button>
  );

  return (
    <div className="d-flex flex-column justify-content-center align-items-center m-1 m-md-3 text-white">
      <div
        className="bombo p-3 p-md-4 position-relative"
        style={{
          width: "95%",
          maxWidth: "900px",
          borderRadius: "30px",
          background: "#252525",
          boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
        }}
      >
        {/* MENU */}
        <div
          className="position-absolute"
          style={{ top: "15px", right: "20px" }}
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
              width: "42px",
              height: "42px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={profilkep}
            alt="profilkep"
          />

          <div className="ms-2">
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {felhasznalonev}
            </div>
          </div>
        </div>

        {/* SZÖVEG */}
        {szoveg && (
          <div
            className="mb-3"
            style={{
              background: "#323232",
              borderRadius: "18px",
              padding: "14px 16px",
              fontSize: "16px",
              lineHeight: "1.45",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayedText}

            {isLongText && (
              <button
                className="btn p-0 ms-1 csetliColor"
                style={{
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
            }}
          >
            <img
              src={`${BASE}/uploads/${feltoltotkep}`}
              alt="poszt"
              style={{
                width: "100%",
                maxHeight: "420px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* ALSÓ RÉSZ */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3">
          <div className="d-flex flex-wrap gap-2">
            <ActionButton
              icon={isLiked ? "❤️" : "🤍"}
              label="Like"
              count={likeCount}
              active={isLiked}
              onClick={handleLike}
            />

            <ActionButton
              icon="💬"
              label="Komment"
              count={comments.length}
              active={false}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* KOMMENT MODAL */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="position-relative background"
            style={{
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              borderRadius: "20px",
              color: "black",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn position-absolute text-white"
              style={{
                top: "10px",
                right: "15px",
                zIndex: 10,
                fontSize: "24px",
              }}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <div className="d-flex h-100 flex-column flex-md-row">
              {/* BAL OLDAL */}
              <div className="col-md-6 p-4 d-flex flex-column border-end border-dark border-opacity-10">
                <div className="d-flex align-items-center mb-3">
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    src={profilkep}
                    alt="profilkep"
                  />
                  <b className="ms-2 csetliColor2 rounded-pill py-1 px-2">
                    {felhasznalonev}
                  </b>
                </div>

                <div className="flex-grow-1 overflow-auto">
                  {feltoltotkep && (
                    <img
                      src={`${BASE}/uploads/${feltoltotkep}`}
                      className="img-fluid rounded mb-3"
                      style={{
                        maxHeight: "300px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt="poszt"
                    />
                  )}

                  {szoveg && (
                    <div
                      className="csetliColor2 p-3 rounded"
                      style={{ fontSize: "14px" }}
                    >
                      {szoveg}
                    </div>
                  )}
                </div>
              </div>

              {/* JOBB OLDAL */}
              <div className="col-md-6 p-4 d-flex flex-column bg-white bg-opacity-10">
                <div className="text-center mb-3">
                  <span className="csetliColor2 px-4 py-1 rounded-pill fw-bold">
                    Kommentek
                  </span>
                </div>

                <div
                  className="flex-grow-1 overflow-auto pe-2 no-scroll"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <style>{`.no-scroll::-webkit-scrollbar { display: none; }`}</style>

                  {comments.length === 0 ? (
                    <div className="h-100 d-flex align-items-center justify-content-center text-center">
                      <span className="csetliColor2 rounded-pill px-3 py-2">
                        Még nincs komment.
                      </span>
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="mb-3 text-end">
                        <div className="small fw-bold mb-1">
                          {c.felhasznalonev}
                        </div>

                        <div
                          className="csetliColor2 d-inline-block p-2 px-3 rounded-pill shadow-sm"
                          style={{
                            fontSize: "13px",
                            maxWidth: "85%",
                            wordBreak: "break-word",
                          }}
                        >
                          {c.szoveg}
                        </div>

                        <div className="text-muted" style={{ fontSize: "13px" }}>
                          {c.ido}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 position-relative">
                  <input
                    type="text"
                    className="form-control rounded-pill csetliColor2 pe-5"
                    placeholder="Ide írd a kommentet..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendComment()
                    }
                  />

                  <button
                    onClick={handleSendComment}
                    className="btn position-absolute end-0 top-0 me-2"
                  >
                    Küldés
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}