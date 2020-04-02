import React, {useEffect, useState} from 'react';
const axios = require("axios");
// import './FullInsert.css';


const FullInsert = ({URL_EQUIPMENTS, URL_MATERIAS, URL_PASSIVES, URL_UNITS}) => {
    

    //Tables 19 total: 3 Core Tables, 15 sub, 1 subsub
    // insert order
    // prettier-ignore
    const [equippable, setEquippable] = useState([]);
    const [skill_passive, setSkill_Passive] = useState([]);
    const [unit, setUnit] = useState([]);
        //next 1
        const [unit_stat, setUnit_Stat] = useState([]);
        const [weapon, setWeapon] = useState([]);
        const [armor, setArmor] = useState([]);
        const [accessory, setAccessory] = useState([]);
        const [materia, setMateria] = useState([]);
            //next 2
            const [materia_unit_restriction, setMateria_Unit_Restriction] = useState([]);
            const [weapon_element_inflict, setWeapon_Element_Inflict] = useState([]);
            const [weapon_status_inflict, setWeapon_Status_Inflict] = useState([]);
            const [weapon_variance, setWeapon_Variance] = useState([]); // Make sure table is ready for insert
            const [equipment_option, setEquipment_Option] = useState([]);
            const [skill_requirement, setSkill_Requirement] = useState([]);
            const [equippable_skill, setEquippable_Skill] = useState([]);
            const [skill_unit_restriction, setSkill_Unit_Restriction] = useState([]);
            const [unit_skill, setUnit_Skill] = useState([]);
            const [unit_role, setUnit_Role] = useState([]);
                //next 3
                const [skill_enhancement, setSkill_Enhancement] = useState([]);
            

    const handleOnClick = () => {
        // console.log("Full Insert Clicked!");
        initialFetch();
    };

    const initialFetch = async () => {
        const units = (await axios.get(URL_UNITS)
            .then(res => res.data));
        const passives = (await axios.get(URL_PASSIVES)
            .then(res => res.data));
        const equipments = (await axios.get(URL_EQUIPMENTS)
            .then(res => res.data));
        const materias = (await axios.get(URL_MATERIAS)
            .then(res => res.data));

        // console.log(units);
    };

    return (
        <button onClick={handleOnClick}>Full Insert</button>
    );

};


export default FullInsert;