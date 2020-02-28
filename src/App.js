import React, { useState, useEffect } from "react";
import "./App.css";

const axios = require("axios");
const _ = require("lodash");

function App() {
  const URL_UNITS =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/units.json";
  const URL_PASSIVES =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/skills_passive.json";

  const URL_TEST = "https://jsonplaceholder.typicode.com/users";

  const [unitList, setUnitList] = useState("");
  useEffect(() => {
    const tmp = async () => {
      const res = await fetch(URL_UNITS);
      const data = await res.json();
      setUnitList(data);
    };
    tmp();
  }, []);

  const [passiveSkillList, setPassiveSkillList] = useState("");
  useEffect(() => {
    const tmp = async () => {
      const res = await axios.get(URL_PASSIVES);
      const data = await res.data;
      setPassiveSkillList(data);
    };
    tmp();
  }, []);

  const [searchField, setSearchField] = useState("");
  useEffect(() => {
    if (
      searchField.length > 0 &&
      searchField[0] == searchField[0].toLowerCase()
    ) {
      setSearchField(searchField[0].toUpperCase() + searchField.slice(1));
    }
  }, [searchField]);

  const [unitTextArea, setUnitTextArea] = useState("");
  const [passiveTextArea, setPassiveTextArea] = useState("");

  const handleSearch = e => {
    const allowed = ["name", "TMR", "sTMR", "game", "roles", "sex", "equip"];
    const passives = ["skills"];

    const filtered = Object.entries(unitList).forEach(([key, value]) => {
      if (value.name === searchField) {
        const unitInfo = Object.keys(value)
          .filter(key => allowed.includes(key))
          .reduce((obj, key) => {
            //  console.log(obj);
            return {
              ...obj,
              [key]: value[key]
            };
          }, {});

        // console.log("fitlered: ", unitInfo);
        setUnitTextArea(JSON.stringify(unitInfo));

        const unitPassiveSkills = Object.keys(value)
          .filter(key => passives.includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: value[key]
            };
          }, {});

        setPassiveTextArea(JSON.stringify(unitPassiveSkills));
        getAbility(unitPassiveSkills.skills);
      }
    });
  };

  const getAbility = abilityList => {
    // console.log(abilityList);

    const abilityIdObj = _.mapValues(abilityList, (value, key) => {
      return value.id;
    });

    // console.log("abilityIdObj: ", abilityIdObj);
    const abilityIdArr = _.values(abilityIdObj);

    console.log("abilityIdArr: ", abilityIdArr);

    const detailedPassiveSkills = _.pickBy(passiveSkillList, (value, key) => {
      return _.includes(abilityIdArr, parseInt(key));
    });

    console.log("Detailed View: ", detailedPassiveSkills);
  };

  const handleSearchFieldChange = e => {
    setSearchField(e.target.value);
  };

  const handleClear = e => {
    setSearchField("");
  };

  return (
    <div className="App" style={appStyle}>
      <label>FFBE Data Scrapper</label>
      <div>
        <input
          type="text"
          value={searchField}
          onChange={handleSearchFieldChange}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <label>Unit Info</label>
      <textarea
        className="unit-textarea"
        rows="30"
        cols="90"
        style={unitTextAreaStyle}
        placeholder="Unit placeholder"
        value={unitTextArea}
        readOnly
      />
      <label>Unit Passives</label>
      <textarea
        className="passive-textarea"
        rows="30"
        cols="50"
        style={unitTextAreaStyle}
        placeholder="Passive placeholder"
        value={passiveTextArea}
        readOnly
      />
    </div>
  );
}

const appStyle = {
  background: "lightblue",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const unitTextAreaStyle = {
  background: "white",
  width: "600px",
  height: "300px"
};

export default App;
