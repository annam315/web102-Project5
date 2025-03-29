import React, { useState, useEffect } from "react";
import "./CatApp.css";

const API_KEY =
  "live_8nHmRlcEcwz6NwNiestUhd5jvHjT5mjUlhyLI0Cjf3D0PgzHbuorYy2QmhgiYnH4";

const CatApp = () => {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchCat = async () => {
    try {
      let response = await fetch(
        "https://api.thecatapi.com/v1/images/search?has_breeds=1",
        {
          headers: { "x-api-key": API_KEY },
        }
      );
      let data = await response.json();

      if (data.length > 0) {
        let breed = data[0].breeds[0];
        if (banList.includes(breed.name)) {
          fetchCat(); // Fetch again if breed is in ban list
          return; // Prevent adding unwanted cat to history
        }

        const newCat = {
          image: data[0].url,
          breed: breed.name,
          origin: breed.origin,
          temperament: breed.temperament,
        };

        setCat(newCat);

        // Only add to history if this is NOT the first load
        setHistory((prevHistory) => {
          if (prevHistory.length === 0) {
            return [newCat]; // First cat only, no duplicate
          }
          return [newCat, ...prevHistory]; // Append normally
        });
      }
    } catch (error) {
      console.error("Error fetching cat:", error);
    }
  };

  const handleBan = (attribute) => {
    setBanList((prev) =>
      prev.includes(attribute)
        ? prev.filter((item) => item !== attribute)
        : [...prev, attribute]
    );
  };

  return (
    <div className="container">
      <h1 className="cat-title">Discover Cats!</h1>
      {cat && (
        <div className="card">
          <img src={cat.image} alt={cat.breed} className="cat-image" />
          <div className="card-content">
            <p onClick={() => handleBan(cat.breed)} className="clickable">
              Breed: {cat.breed}
            </p>
            <p onClick={() => handleBan(cat.origin)} className="clickable">
              Origin: {cat.origin}
            </p>
            <p onClick={() => handleBan(cat.temperament)} className="clickable">
              Temperament: {cat.temperament}
            </p>
          </div>
        </div>
      )}
      <button onClick={fetchCat} className="button">
        Discover New Cat
      </button>

      {banList.length > 0 && (
        <div className="ban-list">
          <h3>Banned Attributes:</h3>
          {banList.map((item, index) => (
            <p
              key={index}
              onClick={() => handleBan(item)}
              className="banned-item"
            >
              {item}
            </p>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>History</h3>
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <img
                  src={item.image}
                  alt={item.breed}
                  className="history-image"
                />
                <p>
                  {item.breed} from {item.origin}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatApp;
