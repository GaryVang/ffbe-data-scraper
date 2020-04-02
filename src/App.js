import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/dbInsert/FullInsert";
import FullInsert from "./components/dbInsert/FullInsert";

const axios = require("axios");
const _ = require("lodash");

function App() {
  const URL_UNITS =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/units.json";
  const URL_PASSIVES =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/skills_passive.json";

  const URL_EQUIPMENTS =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/equipment.json";
  const URL_MATERIAS =
    "https://raw.githubusercontent.com/aEnigmatic/ffbe/master/materia.json";

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
    if (
      //update later to take capitalize any letters after a space
      searchField.indexOf(" ") !== -1 &&
      searchField.indexOf(" ") + 1 < searchField.length &&
      searchField[searchField.indexOf(" ") + 1] !=
        searchField[searchField.indexOf(" ") + 1].toUpperCase()
    ) {
      let index = searchField.indexOf(" ");
      setSearchField(
        searchField.slice(0, index + 1) +
          searchField[index + 1].toUpperCase() +
          searchField.slice(index + 2)
      );
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
            //  console.log(key);
            return {
              ...obj,
              // [key]: value[key]
              [key]: key !== "equip" ? value[key] : JSON.stringify(value[key])
            };
          }, {});

        // console.log("fitlered: ", unitInfo);
        setUnitTextArea(JSON.stringify(unitInfo, null, 2));

        const unitPassiveSkills = Object.keys(value)
          .filter(key => passives.includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: value[key]
            };
          }, {});

        getAbility(unitPassiveSkills.skills);
      }
    });
  };

  const getAbility = unitAbilityList => {
    //returns a list containing the abilities' id
    const abilityIdObj = _.mapValues(unitAbilityList, (value, key) => {
      return value.id;
    });

    // console.log("abilityIdObj: ", abilityIdObj);
    // const abilityIdArr = _.values(abilityIdObj);

    //searches and returns obj containing detailed info on selected unit's skills
    const detailedPassiveSkills = _.pickBy(passiveSkillList, (value, key) => {
      return _.includes(abilityIdObj, parseInt(key));
    });

    const propFilter = {
      name: null,
      effects: null,
      effects_raw: null
    };

    //removes unnecessary properties
    const filteredPassiveSkills = _.mapValues(detailedPassiveSkills, obj => {
      return _.pick(obj, _.keys(propFilter));
    });

    console.log("Detailed View: ", detailedPassiveSkills);
    console.log("Filtered View: ", filteredPassiveSkills);

    // setPassiveTextArea(JSON.stringify(filteredPassiveSkills, null, 2));

    const test = _.mapValues(detailedPassiveSkills, obj => {
      // console.log('test: ', obj);
    });

    // console.log(detailedPassiveSkills[912165]);
    // console.log(detailedPassiveSkills[912165].effects);
    // console.log(detailedPassiveSkills[912165].effects_raw);
    // console.log('500 ', printArr(detailedPassiveSkills[100050].effects_raw));
    // console.log('500 ', JSON.stringify(detailedPassiveSkills[100050].effects_raw));

    //--------------------------------------------Test Code (remove when finished)--------------
    // const mergeTest = _.merge(detailedPassiveSkills[100050].effects, detailedPassiveSkills[100050].effects_raw);
    // const mergeTest = _.zipWith(
    //   detailedPassiveSkills[912165].effects,
    //   detailedPassiveSkills[912165].effects_raw,
    //   (eff, eff_raw) => {
    //     // ({effect, JSON.stringify(raw)})
    //     const effects_raw = JSON.stringify(eff_raw);
    //     const effects = eff;

    //     return { effects, effects_raw };
    //   }
    // );
    //----------------------------------------------------------

    //Returns a more readable version of the skills to be displayed
    const display_filteredPassiveSkills = _.mapValues(
      filteredPassiveSkills,
      obj => {
        let effect_list = _.zipWith(
          obj.effects,
          obj.effects_raw,
          (eff, eff_raw) => {
            const effects_raw = JSON.stringify(eff_raw);
            const effects = eff;

            return { effects, effects_raw };
          }
        );

        const name = obj.name;
        // const effects = effect_list[0].effects;
        // const effects_raw = effect_list[0].effects_raw;
        // return { name, effects, effects_raw };
        return { name, effect_list };
      }
    );

    // console.log(mergeTest);
    // setPassiveTextArea(JSON.stringify(mergeTest, null, 2));

    setPassiveTextArea(JSON.stringify(display_filteredPassiveSkills, null, 2));
    //Use to format the filteredPassiveSkills
    // const output = _.zipWith(key, value, (key, value)=> ({ key, value }));
  };

  const printArr = arr => {
    //remove if left unused by end of 2-28
    let str = "";
    for (let item of arr) {
      if (Array.isArray(item)) str += printArr(item);
      else str += item + ", ";
    }
    return str;
  };

  const handleSearchFieldChange = e => {
    setSearchField(e.target.value);
  };

  const handleClear = e => {
    setSearchField("");
  };

  const handleKeyDown = e => {
    // (e.key === 'Enter') ? handleSearch() :null;
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="App" style={appStyle}>
      <label>FFBE Data Scrapper</label>
      <div>
        <input
          type="text"
          value={searchField}
          onChange={handleSearchFieldChange}
          onKeyDown={handleKeyDown}
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
      <FullInsert 
        URL_EQUIPMENTS = {URL_EQUIPMENTS}
        URL_MATERIAS = {URL_MATERIAS}
        URL_PASSIVES = {URL_PASSIVES}
        URL_UNITS = {URL_UNITS}
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
  width: "700px",
  height: "300px"
};

export default App;
