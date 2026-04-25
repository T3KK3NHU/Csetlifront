import { useState, useEffect } from "react";
import Button from "../Components/Button";

export default function PeopleCard({ felhasznalonev, image, onClick }) {
    const [isFollowing, setIsFollowing] = useState(false);

    // betöltés induláskor
    useEffect(() => {
        const saved = localStorage.getItem(`follow_${felhasznalonev}`);
        if (saved) {
            setIsFollowing(JSON.parse(saved));
        }
    }, [felhasznalonev]);

    const handleFollow = () => {
        setIsFollowing(prev => {
            const newValue = !prev;
            localStorage.setItem(
                `follow_${felhasznalonev}`,
                JSON.stringify(newValue)
            );
            return newValue;
        });
    };

    return (
        <div
            className="bombo"
            style={{
                borderRadius: "45px",
                padding: "20px",
                width: "250px",
                textAlign: "center",
            }}
        >
            <div>
                <img
                    src={image}
                    style={{
                        width: "100%",
                        maxHeight: "200px",
                        minHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "20px",
                        marginBottom: "15px",
                    }}
                />
            </div>

            <div className="d-flex align-items-start" style={{ color: "white" }}>
                {felhasznalonev}
            </div>

            <div style={{ background: "#333333", borderRadius: "45px" }}>
                <Button
                    content={isFollowing ? "Követve" : "Követés"}
                    style={{ borderRadius: "15px", boxShadow: "0px 4px 10px" }}
                    onClick={handleFollow}
                />
            </div>
        </div>
    );
}