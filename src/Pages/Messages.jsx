import React, { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "../Components/Navbar";
import simplehaz from "../kepek/feketeHaz.svg";
import messages from "../kepek/feketeKomment.svg";
import settings from "../kepek/feketeSettings.svg";
import people from "../kepek/feketePeople.svg";
import getLanguage from "../language";
import BaratokCard from "../Components/BaratokCard";
import UzenetekCard from "../Components/UzenetekCard";
import { ismerosok, BASE, uzenetkuldes, getUzenetek, szobakeszites, adataim } from "../api";

export default function Messages() {
    const [smerosok, setIsmerosok] = useState([]);
    const [lang, setLang] = useState(getLanguage("1"));
    const [ismerosId, setIsmerosId] = useState(null);
    const [szobaId, setSzobaId] = useState(null);
    const [text, setText] = useState("");
    const [sajatKep, setSajatKep] = useState(null);
    const [kivalasztottIsmerosKep, setKivalasztottIsmerosKep] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        (async () => {
            const data = await ismerosok();
            console.log("ismerosok valasz:", data);
            if (data.result && Array.isArray(data.ismerosok)) {
                setIsmerosok(data.ismerosok);
            } else {
                setIsmerosok([]);
            }
            console.log("ismerosok ID:", ismerosId);
        })();

        (async () => {
            const me = await adataim();
            if (me.result) setSajatKep(me.user?.kep ?? null);
        })();

        const language = JSON.parse(localStorage.getItem("language")) || { lang: "0" };
        setLang(getLanguage(language.lang));
    }, []);
    const [uzenet, setUzenet] = useState([]);

    const sortedUzenetek = useMemo(() => {
        const getTime = (m) => {
            const raw =
                m?.createdAt ??
                m?.created_at ??
                m?.timestamp ??
                m?.time ??
                m?.datum ??
                m?.kuldve ??
                m?.letrehozva;
            if (typeof raw === "number") return raw;
            if (typeof raw === "string") {
                const t = Date.parse(raw);
                if (!Number.isNaN(t)) return t;
            }
            const id = typeof m?.id === "number" ? m.id : Number(m?.id);
            return Number.isFinite(id) ? id : 0;
        };

        return [...uzenet].sort((a, b) => getTime(a) - getTime(b));
    }, [uzenet]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [sortedUzenetek.length, szobaId]);

    useEffect(() => {
        if (!szobaId) return;

        async function loadMessages() {
            const res = await getUzenetek(szobaId);
            if (res.result) {
                setUzenet(res.message.uzenetek);
            }
        }

        loadMessages();

        const interval = setInterval(loadMessages, 2000);

        return () => clearInterval(interval);
    }, [szobaId]);

    const sendMessage = async () => {
        if (!szobaId || !text.trim()) return;

        const currentText = text;
        setText("");

        const res = await uzenetkuldes(szobaId, currentText);
        if (res.result) {
            //frisit hogy jo legyen a sorend
            const refreshed = await getUzenetek(szobaId);
            if (refreshed.result) setUzenet(refreshed.message.uzenetek);
        }
    };

    return (
        <div className="background" style={{ height: 100, overflow: "hidden" }}>
            <Navbar homeI={simplehaz} messagesI={messages} settingsI={settings} peopleI={people} />
            <div className="row d-flex flex-column justify-content-start background text-white" style={{ paddingTop: "100px" }}>
                <div className="d-flex flex-row container">
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex flex-column vh-80 align-items-start m-3 bombo px-4 p-2">
                        <div className="d-flex flex-row mt-5">
                            <h4 className="d-flex text-white">Barátok</h4>
                            <div className="m-1">(  {smerosok.length} )</div>
                        </div>
                        {smerosok.length > 0 ? (
                            smerosok.map((ismeros, index) => (
                                <BaratokCard
                                    key={index}
                                    profilkep={`${BASE}/uploads/${ismeros.kep}`}
                                    felhasznalonev={ismeros.felhasznalo_nev}
                                    onClick={async () => {
                                        console.log("clicked:", ismeros.felhasznalo_id);

                                        setIsmerosId(ismeros.felhasznalo_id);
                                        setKivalasztottIsmerosKep(ismeros.kep);

                                        const res = await szobakeszites(ismeros.felhasznalo_id);

                                        if (res.result) {
                                            setSzobaId(res.szobaId);
                                        } else {
                                            alert(res.message || "Szerverhiba (szoba létrehozás)")
                                        }
                                    }
                                    }
                                />
                            ))
                        ) : (
                            <p>Nincsnek barataid :(</p>
                        )}
                    </div>

                    <div className="d-flex align-items-start bombo m-3" style={{ height: "815px", overflow: "overlay", scrollbarWidth: "none" }}>
                        <div className="flex-grow-1 d-flex flex-column h-100 p-3">
                            {/* ÜZENETEK */}
                            <div className="flex-grow-1">
                                {sortedUzenetek.map((msg, i) =>
                                    msg.felhasznalo_id === ismerosId ? (
                                        <UzenetekCard
                                            key={msg.id ?? i}
                                            balUzenet={msg.szoveg}
                                            balProfilkep={kivalasztottIsmerosKep ? `${BASE}/uploads/${kivalasztottIsmerosKep}` : undefined}
                                            jobbProfilkep={sajatKep ? `${BASE}/uploads/${sajatKep}` : undefined}
                                        />

                                    ) : (
                                        <UzenetekCard
                                            key={msg.id ?? i}
                                            jobbUzenet={msg.szoveg}
                                            balProfilkep={kivalasztottIsmerosKep ? `${BASE}/uploads/${kivalasztottIsmerosKep}` : undefined}
                                            jobbProfilkep={sajatKep ? `${BASE}/uploads/${sajatKep}` : undefined}
                                        />
                                    )
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* INPUT */}
                            <div className="d-flex p-2" style={{ maxWidth: "97%" }}>
                                <input
                                    className="form-control"
                                    placeholder="Üzenet..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button
                                    className="btn csetliColor me-auto"
                                    onClick={sendMessage}
                                >
                                    Küldés
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}