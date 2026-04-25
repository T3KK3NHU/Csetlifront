import { useState, useEffect, useRef } from "react";
import LikeIcon from "../kepek/Comment.png"
import Comment from "../kepek/Comment.png"
import "../style/style.css"
import { deleteBejegyzes, BASE, komment } from "../api";

export default function PostCard({ bejegyzes_id, profilkep, felhasznalonev, feltoltotkep, szoveg }) {
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Csak a modálhoz
    const [newComment, setNewComment] = useState("");
    const menuRef = useRef(null);

    // Példa kommentek a modálhoz
    const [comments, setComments] = useState([
        { id: 1, felhasznalo: "Eleanor Pena", szoveg: "Szia! Ez egy teszt komment.", ido: "2025.10.09 17:40" }
    ]);

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
    if (!newComment.trim()) return; // nincs ures kome

    try {
      const res = await fetch(`${BASE}/komment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tartalom: newComment,
          bejegyzes_id: bejegyzes_id,
        }),
      });

      const data = await res.json();

        setNewComment(''); // torles kuldes utan
      
    } catch (error) {
      alert(`Szerverhiba: ${error.message}`);
    }
  }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center m-1 m-md-3 text-white">
            <div className="bombo p-3 p-md-4 position-relative" style={{ width: "95%", maxWidth: "600px" }}>
                <div className="position-absolute" style={{ top: "15px", right: "20px" }} ref={menuRef}>
                    <button className="btn text-white border-0" type="button" style={{ fontSize: "20px", background: "transparent" }} onClick={() => setShowMenu(!showMenu)}>
                        &#8942;
                    </button>

                    {showMenu && (
                        <div className="bg-dark border border-secondary rounded p-2 shadow" style={{ position: "absolute", right: 0, zIndex: 1000, minWidth: "120px" }}>
                            <div className="p-2 border-bottom border-secondary text-white hover-item" style={{ cursor: "pointer" }} onClick={() => setShowMenu(false)}>
                                <small>Szerkesztés</small>
                            </div>
                            <div className="p-2 text-danger hover-item" style={{ cursor: "pointer" }} onClick={async () => {
                                setShowMenu(false);
                                const res = await deleteBejegyzes(bejegyzes_id)
                                window.location.reload();
                                alert(res.message);
                            }}>
                                <small>Törlés</small>
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex flex-row align-items-center m-2">
                    <div className="mx-1">
                        <img style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }} src={profilkep} alt="profilkep" />
                    </div>
                    <div className="mx-1" style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {felhasznalonev}
                    </div>
                </div>

                {feltoltotkep && !szoveg && (
                    <div className="d-flex justify-content-center m-2" >
                        <img className="img-fluid" style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "25px", width: "100%" }} src={`${BASE}/uploads/${feltoltotkep}`} alt="poszt" />
                    </div>
                )}

                {feltoltotkep && szoveg && (
                    <div className="d-flex flex-column flex-md-row m-2" style={{ background: "#333333", borderRadius: "25px", overflow: "hidden" }}>
                        <div style={{ flex: "0 0 auto" }}>
                            <img src={`${BASE}/uploads/${feltoltotkep}`} alt="poszt" style={{ width: "100%", minWidth: "200px", maxWidth: "100%", height: "250px", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ flex: 1, padding: "15px", fontSize: "16px", overflowWrap: "anywhere", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                            {szoveg}
                        </div>
                    </div>
                )}

                {!feltoltotkep && szoveg && (
                    <div className="m-2 p-3" style={{ fontSize: "18px", background: "#333333 ", borderRadius: "20px", wordBreak: "break-word" }}>
                        {szoveg}
                    </div>
                )}

                <div className="d-flex flex-wrap m-2">
                    <div className="mx-1"><img src={LikeIcon} alt="like" style={{width: "24px"}} /></div>
                    <div className="mx-1"><img src={LikeIcon} alt="like" style={{width: "24px"}} /></div>
                    <div className="mx-1"><img src={LikeIcon} alt="like" style={{width: "24px"}} /></div>
                    <div className="mx-1 text-secondary"></div>
                        <div style={{fontSize: "14px", cursor: "pointer"}} onClick={() => setIsModalOpen(true)}>
                             komment
                        </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                     style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999 }}>
                    
                    <div className="position-relative" style={{ width: "90%", maxWidth: "900px", height: "80vh", background: "#e67e22", borderRadius: "20px", color: "black", overflow: "hidden" }}>
                        
                        <button className="btn position-absolute text-white" style={{ top: "10px", right: "15px", zIndex: 10, fontSize: "24px" }} onClick={() => setIsModalOpen(false)}>&times;</button>

                        <div className="d-flex h-100 flex-column flex-md-row">
                            {/* Bal oldal - Poszt infó */}
                            <div className="col-md-6 p-4 d-flex flex-column border-end border-dark border-opacity-10">
                                <div className="d-flex align-items-center mb-3">
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%" }}></div>
                                    <b className="ms-2">{felhasznalonev}</b>
                                </div>
                                <div className="flex-grow-1 overflow-auto">
                                    {feltoltotkep && <img src={`${BASE}/uploads/${feltoltotkep}`} className="img-fluid rounded mb-3" style={{maxHeight: "300px", width: "100%", objectFit: "cover"}} />}
                                    <div className="bg-light p-3 rounded" style={{fontSize: "14px"}}>{szoveg}</div>
                                </div>
                            </div>

                            {/* Jobb oldal - Kommentek */}
                            <div className="col-md-6 p-4 d-flex flex-column bg-white bg-opacity-10">
                                <div className="text-center mb-3">
                                    <span className="bg-white px-4 py-1 rounded-pill fw-bold">Komment</span>
                                </div>

                                <div className="flex-grow-1 overflow-auto pe-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                                    <style>{`.no-scroll::-webkit-scrollbar { display: none; }`}</style>
                                    <div className="no-scroll">
                                        {comments.map(c => (
                                            <div key={c.id} className="mb-3 text-end">
                                                <div className="small fw-bold mb-1">{c.felhasznalo} <div className="d-inline-block" style={{width: "20px", height: "20px", borderRadius: "50%", verticalAlign: "middle"}}></div></div>
                                                <div className="bg-white d-inline-block p-2 px-3 rounded-pill shadow-sm" style={{fontSize: "13px"}}>{c.szoveg}</div>
                                                <div className="text-muted" style={{fontSize: "10px"}}>{c.ido}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/*FELKESZ MEG NEM JELENIT KOMENTET*/}
                                <div className="mt-3 position-relative">
                                    <input type="text" className="form-control rounded-pill" placeholder="Ide írd a kommentet..." value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendComment()} />
                                    <button onClick={handleSendComment} className="btn position-absolute end-0 top-0 mt-1 me-2">Küldés</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}