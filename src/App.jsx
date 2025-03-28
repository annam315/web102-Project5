import React, { useState, useEffect } from "react";
import "./CatApp.css";

const API_URL = "https://api.thecatapi.com/v1/images/search?breed_ids=";
const API_KEY = "live_8nHmRlcEcwz6NwNiestUhd5jvHjT5mjUlhyLI0Cjf3D0PgzHbuorYy2QmhgiYnH4"; // Replace with your Cat API key

const CatApp = () => {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    try {
      let response = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1", {
        headers: { "x-api-key": API_KEY },
      });
      let data = await response.json();
      
      if (data.length > 0) {
        let breed = data[0].breeds[0];
        if (banList.includes(breed.name)) {
          fetchCat(); // Fetch again if breed is in ban list
        } else {
          setCat({
            image: data[0].url,
            breed: breed.name,
            origin: breed.origin,
            temperament: breed.temperament,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching cat:", error);
    }
  };

  useEffect(() => {
    fetchCat();
  }, []);

  const handleBan = (attribute) => {
    setBanList((prev) => (prev.includes(attribute) ? prev.filter((item) => item !== attribute) : [...prev, attribute]));
  };

  return (
    <div className="container">
      <h1 className="cat-title">Discover Cats!</h1>
      {cat && (
        <div className="card">
          <img src={cat.image} alt={cat.breed} className="cat-image" />
          <div className="card-content">
            <p onClick={() => handleBan(cat.breed)} className="clickable">Breed: {cat.breed}</p>
            <p onClick={() => handleBan(cat.origin)} className="clickable">Origin: {cat.origin}</p>
            <p onClick={() => handleBan(cat.temperament)} className="clickable">Temperament: {cat.temperament}</p>
          </div>
        </div>
      )}
      <button onClick={fetchCat} className="button">Discover New Cat</button>
      {banList.length > 0 && (
        <div className="ban-list">
          <h3>Banned Attributes:</h3>
          {banList.map((item, index) => (
            <p key={index} onClick={() => handleBan(item)} className="banned-item">{item}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatApp;
