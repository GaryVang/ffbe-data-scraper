import React, {useEffect, useState} from 'react';
const axios = require("axios");
const _ = require("lodash");
// import './FullInsert.css';


const FullInsert = ({URL_EQUIPMENTS, URL_MATERIAS, URL_PASSIVES, URL_UNITS}) => {
    
    //--------------------------Test Area

    // useEffect(() => console.log('unit_stat: ', unit_stat), [unit_stat]);


    //-------------------------End Test Area

    //Tables 19 total: 3 Core Tables, 15 sub, 1 subsub
    // insert order
    // prettier-ignore
    const [unit, setUnit] = useState([]); // 1 = completed
    // useEffect(() => console.log('unit: ', unit), [unit]);
    const [equippable, setEquippable] = useState([]);
    const [skill_passive, setSkill_Passive] = useState([]); // 1
    

        const[equipment, setEquipment] = useState([]);
        //next 1
        const [unit_stat, setUnit_Stat] = useState([]); // 1
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
            const [skill_requirement, setSkill_Requirement] = useState([]); // 1
            const [equippable_skill, setEquippable_Skill] = useState([]);
            const [skill_unit_restriction, setSkill_Unit_Restriction] = useState([]); // 1
            const [unit_skill, setUnit_Skill] = useState([]);
            const [unit_role, setUnit_Role] = useState([]); // 1
                //next 3
                const [skill_enhancement, setSkill_Enhancement] = useState([]);
            

    const handleOnClick = () => {
        // console.log("Full Insert Clicked!");
        initialFetch();
    };

    const initialFetch = async () => {
        const units = (await axios.get(URL_UNITS)
            .then(res => res.data));
        const skill_passives = (await axios.get(URL_PASSIVES)
            .then(res => res.data));
        const equipments = (await axios.get(URL_EQUIPMENTS)
            .then(res => res.data));
        const materias = (await axios.get(URL_MATERIAS)
            .then(res => res.data));


        _.forOwn(units, (value, key) => {
            // console.log(typeof key);
            // if(value.rarity_max === 7 && (key == 401006805 || key == 401008405)){
            if(value.rarity_max === 7 && /^[a-zA-Z0-9- ]*$/.test(value.name) == true){
                // console.log(key);
                unitInsertPrep(value, key);
            }
        });

        _.forOwn(skill_passives, (value, key) => {
            if(/^[a-zA-Z0-9- ]*$/.test(value.name) == true){
                skillPassivesInsertPrep(value, key);
            }
        });

        _.forOwn(equipments, (value, key) => {
            if(/^[a-zA-Z0-9- ]*$/.test(value.name) == true){
                equipmentsInsertPrep(value, key);
            }
        });

        _.forOwn(materias, (value, key) => {
            if(/^[a-zA-Z0-9- ]*$/.test(value.name) == true){
                materiasInsertPrep(value, key);
            }
        });
    };

    const skillPassivesInsertPrep = (value, key) => {
        setSkill_Passive(oldInfo => [...oldInfo, {
            skill_id: parseInt(key),
            name: value.name,
            rarity: value.rarity,
            effect: value.effects,
            effect_code: value.effects_raw,
            limited: value.unique
        }]);

        if(value.unit_restriction != null){
            for(let i=0; i<(value.unit_restriction).length; i++){
                setSkill_Unit_Restriction(oldInfo => [...oldInfo, {
                    skill_id: parseInt(key),
                    unit_id: value.unit_restriction[i]
                }])
            }
        }

        if(value.requirements != null){
            for(let i=0; i<(value.requirements).length;i++){
                for(let j=0; j<(value.requirements[i]).length;j++){
                    if(value.requirements[i][0] !== "SWITCH"){
                        setSkill_Requirement(oldInfo => [...oldInfo, {
                            skill_id: parseInt(key),
                            requirement: value.requirements[i][0],
                            eq_id: value.requirements[i][1]
                        }]);
                    }
                }
            }
        }
    };

    const equipmentsInsertPrep = (value, key) => {

    };

    const materiasInsertPrep = (value, key) => {

    };

    const unitInsertPrep = async (value, key) => {
        // if(value.sTMR == null){
        //     console.log('stmr: ', value.sTMR);
        //     console.log('key: ', key);
        // }
        
        let unitTable = {unit_id: parseInt(key), name: value.name, sex: value.sex,
            game: value.game, tmr: value.TMR[1], stmr: value.sTMR[1]};
        setUnit(oldArray => [...oldArray, unitTable]);

        // ----------------unit_role table
        // if(value.roles == null){
        //     console.log('no role, ', key);
        // }
        if(value.roles != null){ // Datamine error for units: A2 (310000505) and Edge (204001113)
            for(let i=0;i<(value.roles).length;i++){
                setUnit_Role(oldArray => [...oldArray, {unit_id: parseInt(key), role: value.roles[i]}]);
            }
        }
        //------------------------End of unit_role
        
        _.forOwn(value.entries, (subValue, subKey) => {
            if(subValue.rarity === 7){
                setUnit_Stat(oldInfo => [ ...oldInfo, {
                    unit_id: parseInt(key), 
                    rarity: subValue.rarity, 
                    hp_base: subValue.stats.HP[1],
                    hp_pot: subValue.stats.HP[2],
                    hp_door: subValue.stats.HP[3],
                    mp_base: subValue.stats.MP[1],
                    mp_pot: subValue.stats.MP[2],
                    mp_door: subValue.stats.MP[3],
                    atk_base: subValue.stats.ATK[1],
                    atk_pot: subValue.stats.ATK[2],
                    atk_door: subValue.stats.ATK[3],
                    def_base: subValue.stats.DEF[1],
                    def_pot: subValue.stats.DEF[2],
                    def_door: subValue.stats.DEF[3],
                    mag_base: subValue.stats.MAG[1],
                    mag_pot: subValue.stats.MAG[2],
                    mag_door: subValue.stats.MAG[3],
                    spr_base: subValue.stats.SPR[1],
                    spr_pot: subValue.stats.SPR[2],
                    spr_door: subValue.stats.SPR[3],

                    fire_resist: subValue.element_resist[0],
                    ice_resist: subValue.element_resist[1],
                    lightning_resist: subValue.element_resist[2],
                    water_resist: subValue.element_resist[3],
                    wind_resist: subValue.element_resist[4],
                    earth_resist: subValue.element_resist[5],
                    light_resist: subValue.element_resist[6],
                    dark_resist: subValue.element_resist[7],

                    poison_resist: subValue.status_resist[0],
                    blind_resist: subValue.status_resist[1],
                    sleep_resist: subValue.status_resist[2],
                    silence_resist: subValue.status_resist[3],
                    paralyze_resist: subValue.status_resist[4],
                    confusion_resist: subValue.status_resist[5],
                    disease_resist: subValue.status_resist[6],
                    petrify_resist: subValue.status_resist[7],
                    physical_resist: subValue.physical_resist,
                    magical_resist: subValue.magical_resist,
                    white_magic_affinity: subValue.magic_affinity[0],
                    black_magic_affinity: subValue.magic_affinity[1],
                    green_magic_affinity: subValue.magic_affinity[2],
                    blue_magic_affinity: subValue.magic_affinity[3]
                }]);
            }
        });
        
    };

    return (
        <button onClick={handleOnClick}>Full Insert</button>
    );

};


export default FullInsert;