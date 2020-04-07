import React, {useEffect, useState} from 'react';
const axios = require("axios");
const _ = require("lodash");
// import './FullInsert.css';


const FullInsert = ({URL_EQUIPMENTS, URL_MATERIAS, URL_PASSIVES, URL_UNITS}) => {
    
    //--------------------------Test Area
   
    // const [equippable, setEquippable] = useState([]); // 1 but needs a test; 1st test successful
    // useEffect(() => console.log('equipment: ', equippable), [equippable]);

    //-------------------------End Test Area

    //Tables 19 total: 3 Core Tables, 15 sub, 1 subsub
    // insert order
    // prettier-ignore does not work
    const [unit, setUnit] = useState([]); // 1 = completed; special char test completed
    const [equippable, setEquippable] = useState([]); // 1 but needs a test; 1st test successful; 2nd successful
    const [skill_passive, setSkill_Passive] = useState([]); // 1
    

        const[equipment, setEquipment] = useState([]); // 1
        //next 1
        const [unit_stat, setUnit_Stat] = useState([]); // 1
        const [weapon, setWeapon] = useState([]);
        const [armor, setArmor] = useState([]); // 1
        const [accessory, setAccessory] = useState([]); // 1
        const [materia, setMateria] = useState([]); // 1
            //next 2
            const [materia_unit_restriction, setMateria_Unit_Restriction] = useState([]); // 1
            const [weapon_element_inflict, setWeapon_Element_Inflict] = useState([]); // 1
            const [weapon_status_inflict, setWeapon_Status_Inflict] = useState([]); // 1
            const [weapon_variance, setWeapon_Variance] = useState([]); // Make sure table is ready for insert
            const [equipment_option, setEquipment_Option] = useState([]); // 1
            const [skill_requirement, setSkill_Requirement] = useState([]); // 1
            const [equippable_skill, setEquippable_Skill] = useState([]); // 1 Tests for both mat and eq completed
            const [skill_unit_restriction, setSkill_Unit_Restriction] = useState([]); // 1
            const [unit_skill, setUnit_Skill] = useState([]);
            const [unit_role, setUnit_Role] = useState([]); // 1
                //next 3
                const [skill_enhancement, setSkill_Enhancement] = useState([]);
                const [equipment_unit_requirement, setEquipment_Unit_Requirement] = useState([]); // 1
                const [equipment_sex_requirement, setEquipment_Sex_Requirement] = useState([]); // 1
            

    const handleOnClick = () => {
        // console.log("Full Insert Clicked!");
        initialFetch();
    };

    const initialFetch = async () => {
        const unitsList = (await axios.get(URL_UNITS)
            .then(res => res.data));
        const skillPassivesList = (await axios.get(URL_PASSIVES)
            .then(res => res.data));
        const equipmentsList = (await axios.get(URL_EQUIPMENTS)
            .then(res => res.data));
        const materiasList = (await axios.get(URL_MATERIAS)
            .then(res => res.data));


        _.forOwn(unitsList, (value, key) => {
            // console.log(typeof key);
            // if(value.rarity_max === 7 && (key == 401006805 || key == 401008405)){
            if(value.rarity_max === 7 && /^[a-zA-Z0-9-()'+&è.é ]*$/.test(value.name) == true){
                // console.log(key);
                unitInsertPrep(value, key);
            }
            // else if (value.rarity_max === 7){ // Test rejected units for unspecified special characters
            //     console.log(value.name);
            // }
        });

        _.forOwn(skillPassivesList, (value, key) => {
            if(/^[a-zA-Z0-9-()-\[\]'+&è!:./%,↑?âÜé ]*$/.test(value.name) == true){
                skillPassivesInsertPrep(value, key);
                // if(key === "231410"){
                //     console.log(1, value.name);
                // }
            }
            // else { //Checks rejected for unspecified special characters
            //     console.log(value.name);
            // }
        });

        
//-------------------------------------------------------------------------------------------------------------Requires API setup to complete
        // Inserts all possible weapon variances into TABLE weapon_variance
        // Then retrieves it.
        let dmgVarArr = [];
        _.forOwn(equipmentsList, (value, key) => {
            if(/^[a-zA-Z0-9-()'+&è.Üá:ô\s ]*$/.test(value.name) == true && 
                    value.type_id <= 16 && 
                    value.type_id > 0 && 
                    value.dmg_variance != null){
                if(!_.findIndex(dmgVarArr, (o) => {return _.isMatch(o, {lower_limit: value.dmg_variance[0], upper_limit: value.dmg_variance[1], type: value.type_id})}) > -1){
                    dmgVarArr.push({
                        lower_limit: value.dmg_variance[0],
                        upper_limit: value.dmg_variance[1],
                        type: value.type_id,
                    });
                } 
            } 
        });
        // console.log(dmgVarArr);
        // Retrieve updated list of weapon_variances via api call


        _.forOwn(equipmentsList, (value, key) => {
            // if(/^[a-zA-Z0-9- ]*$/.test(value.name) == true && key == 403041100){
            if(/^[a-zA-Z0-9-()'+&è.Üá:ô\s ]*$/.test(value.name) == true){ // \s is for Copper Cuirass
                equipmentsInsertPrep(value, key);
                if(value.skills != null){
                    hasPassiveSkill(value, key, skillPassivesList);
                } 
            } 
            // else if(key === '406000200') { // 406000200;  Copper Cuirass ends with a space
            //     console.log("Data Entry Error! ", value.name);
            // }
            // else {
            //     console.log(value.name);
            // }
        });

        _.forOwn(materiasList, (value, key) => {
            if(/^[a-zA-Z0-9-()'+&è!%/:↑ ]*$/.test(value.name) == true && hasPassiveSkill(value, key, skillPassivesList)){
                materiasInsertPrep(value, key);
            } 
            // else { // test to see if name contained unspecified special character(s)
            //     console.log(2, value.name);
            // }
        });
    };

    const hasPassiveSkill = (value, key, skillPassivesList) => { // Uber Falcon Blade: key=302010900
        let pFlag = false;
        // if(key == 504010010){
        //     console.log( key);
        // }
        for(let i=0; i<(value.skills).length;i++){
            if( _.has(skillPassivesList, value.skills[i].toString()) && (/^[a-zA-Z0-9-()'+&è.Üá:ô,%?!/↑  ]*$/.test(skillPassivesList[value.skills[i]].name) == true)){
                // console.log(skillPassivesList[value.skills[i]].name);
                setEquippable_Skill(oldInfo => [...oldInfo, {
                    eq_id: parseInt(key),
                    skill_id: value.skills[i]
                }]);
                pFlag = true;
            } 
            // Checks if rejected passive skill was rejected due to a special character/foreign name
            // else if ( _.has(skillPassivesList, value.skills[i].toString())){ // SAVE: test 
            //     console.log(1);
            //     console.log(skillPassivesList[value.skills[i]].name);
            // }
        }
        return pFlag;
    }

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
                    if(value.requirements[i][0] !== "SWITCH"){ // SWITCH = unlocks via SBB (Series Boss Battle)
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
        
        let elArr = [0,0,0,0,0,0,0,0];
        let statusArr = [0,0,0,0,0,0,0,0];

        if(value.stats.element_resist != null){
            for(let el in value.stats.element_resist){
                switch(el) {
                    case "Fire":
                        elArr[0] = value.stats.element_resist[el];
                        break;
                    case "Ice":
                        elArr[1] = value.stats.element_resist[el];
                        break;
                    case "Lightning":
                            elArr[2] = value.stats.element_resist[el];
                            break;
                    case "Water":
                        elArr[3] = value.stats.element_resist[el];
                        break;
                    case "Wind":
                        elArr[4] = value.stats.element_resist[el];
                        break;
                    case "Earth":
                        elArr[5] = value.stats.element_resist[el];
                        break;
                    case "Light":
                        elArr[6] = value.stats.element_resist[el];
                        break;
                    case "Dark":
                        elArr[7] = value.stats.element_resist[el];
                        break;
                }
            }
        }

        if(value.stats.status_resist != null){
            for(let el in value.stats.status_resist){
                switch(el) {
                    case "Poison":
                        statusArr[0] = value.stats.status_resist[el];
                        break;
                    case "Blind":
                        statusArr[1] = value.stats.status_resist[el];
                        break;
                    case "Sleep":
                            statusArr[2] = value.stats.status_resist[el];
                            break;
                    case "Silence":
                        statusArr[3] = value.stats.status_resist[el];
                        break;
                    case "Paralyze":
                        statusArr[4] = value.stats.status_resist[el];
                        break;
                    case "Confusion":
                        statusArr[5] = value.stats.status_resist[el];
                        break;
                    case "Disease":
                        statusArr[6] = value.stats.status_resist[el];
                        break;
                    case "Petrify":
                        statusArr[7] = value.stats.status_resist[el];
                        break;
                }
            }
        }

        if(value.stats.element_inflict != null){
            for(let el in value.stats.element_inflict){
                setWeapon_Element_Inflict(oldInfo => [...oldInfo, {
                    weapon_id: parseInt(key),
                    element: value.stats.element_inflict[el]
                }]);  
            }
        }

        if(value.stats.status_inflict != null){
            for(let el in value.stats.status_inflict){
                setWeapon_Status_Inflict(oldInfo => [...oldInfo, {
                    weapon_id: parseInt(key),
                    status: el,
                    chance: value.stats.status_inflict[el]
                }]);
            }
        }

        setEquippable(oldInfo => [...oldInfo, {
            eq_id: parseInt(key),
            name: value.name
        }]);
        
        setEquipment(oldInfo => [...oldInfo, {
            equipment_id: parseInt(key),
            rarity: value.rarity,
            hp: value.stats.HP,
            mp: value.stats.MP,
            atk: value.stats.ATK,
            def: value.stats.DEF,
            mag: value.stats.MAG,
            spr: value.stats.SPR,
            fire_resist: elArr[0],
            ice_resist: elArr[1],
            lightning_resist: elArr[2],
            water_resist: elArr[3],
            wind_resist: elArr[4],
            earth_resist: elArr[5],
            light_resist: elArr[6],
            dark_resist: elArr[7],
            poison_resist: statusArr[0],
            blind_resist: statusArr[1],
            sleep_resist: statusArr[2],
            silence_resist: statusArr[3],
            paralyze_resist: statusArr[4],
            confusion_resist: statusArr[5],
            disease_resist: statusArr[6],
            petrify_resist: statusArr[7]
        }]);

        // Handles requirements
        if(value.requirements != null){ 
            switch(value.requirements[0]) {
                case "UNIT_ID":
                    // console.log(1);
                    if( Object.prototype.toString.call( value.requirements[1] ) !== '[object Array]' ) {
                        setEquipment_Unit_Requirement(oldInfo => [...oldInfo, {
                            equipment_id: parseInt(key),
                            unit_id: value.requirements[1]
                        }]);
                    } else {
                        for(let i=0;i<(value.requirements[1]).length;i++){
                            setEquipment_Unit_Requirement(oldInfo => [...oldInfo, {
                                equipment_id: parseInt(key),
                                unit_id: value.requirements[1][i]
                            }]);
                        }
                    }
                    break;
                case "SEX":
                    if( Object.prototype.toString.call( value.requirements[1] ) !== '[object Array]' ) {
                        setEquipment_Sex_Requirement(oldInfo => [...oldInfo, {
                            equipment_id: parseInt(key),
                            sex_id: value.requirements[1]
                        }])
                    } else {
                        for(let i=0;i<(value.requirements[1]).length;i++){
                            setEquipment_Unit_Requirement(oldInfo => [...oldInfo, {
                                equipment_id: parseInt(key),
                                sex_id: value.requirements[1][i]
                            }]);
                        }
                    }
                    break;
            }
        }



        if(value.type_id <= 16 && value.type_id > 0){
            setWeapon(oldInfo => [...oldInfo, {
                weapon_id: parseInt(key),
                type: value.type_id,
                is_twohanded: value.is_twohanded,
                accuracy: value.accuracy,
                variance_id: getVariance(value.type_id, value.is_twohanded, value.dmg_variance)
            }]);
        } else if (value.type_id === 30 
            || value.type_id === 31 
            || value.type_id === 40
            || value.type_id === 41
            || value.type_id === 50
            || value.type_id === 51
            || value.type_id === 52
            || value.type_id === 53){
            setArmor(oldInfo => [...oldInfo, {
                armor_id: parseInt(key),
                type: value.type_id
            }]);
        } else if(value.type_id === 60){
            // console.log (value.name);
            setAccessory(oldInfo => [...oldInfo, {
                acc_id: parseInt(key),
                type: value.type_id
            }]);
        }

        // if(value.is_twohanded === false){
        //     console.log(key, value.dmg_variance);
        // }

        
        
    };

    const getVariance = (type_id, is_twohanded, dmg_variance) => {
        if(dmg_variance == null){
            if(is_twohanded === false){
                switch(type_id) { // 0 will throw an error during db insert and will be rejected
                    case 1: // Dagger
                        return 1;
                    case 2: // Sword
                        return 2;
                    case 3: // Great Sword
                        return 4;
                    case 4: // Katana
                        return 6;
                    case 5: // Staff
                        return 8;
                    case 6: // Rod
                        return 9;
                    case 7: // Bow: no standard
                        return 0;
                    case 8: // Axe
                        return 11;
                    case 9: // Hammer
                        return 13;
                    case 10: // Spear
                        return 14;
                    case 11: // Instrument
                        return 16;
                    case 12: // Whip
                        return 18;
                    case 13: // Throwing
                        return 19;
                    case 14: // Gun
                        return 20;
                    case 15: // Mace
                        return 23;
                    case 16: // Fist
                        return 25;
                }
            } else { // Currently this block is unreachable, thus unused, due to no cases
                return 0;
            }
        } else {// setWeapon_Variance
            // update list of variance with insert statement
            // retrieve list of variances from api is up-to-date
            
        }

        return 0;
    };

    const materiasInsertPrep = (value, key) => { 
        // console.log(typeof value.unique);
        setMateria(oldInfo => [...oldInfo, {
            mat_id: parseInt(key),
            limted: value.unique
        }]);

        setEquippable(oldInfo => [...oldInfo, {
            eq_id: parseInt(key),
            name: value.name
        }]);

        if(value.unit_restriction != null) {
            for(let i=0;i<(value.unit_restriction).length;i++){
                setMateria_Unit_Restriction(oldInfo => [...oldInfo, {
                    mat_id: parseInt(key),
                    unit_restriction: value.unit_restriction[i]
                }]);
            }
        }
    };

    const unitInsertPrep = (value, key) => {
        // if(value.sTMR == null){
        //     console.log('stmr: ', value.sTMR);
        //     console.log('key: ', key);
        // }
        
        let unitTable = {unit_id: parseInt(key), name: value.name, sex: value.sex_id,
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
        
        // if(value.equip != null){
            for(let i=0; i<(value.equip).length;i++){
                setEquipment_Option(oldInfo => [...oldInfo, {
                    unit_id: parseInt(key),
                    equipment_type: value.equip[i]
                }]);
            }
        // }

    };

    return (
        <button onClick={handleOnClick}>Full Insert</button>
    );

};


export default FullInsert;