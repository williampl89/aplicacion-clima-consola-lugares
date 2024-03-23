import colors from 'colors';
import { leerInput, inquirerMenu, pausa, listarLugares} from './helpers/inquirer.js';
import Busquedas from './models/busquedas.js';

const main = async()=>{

    const busquedas = new Busquedas();
    let opt = '';

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1: 
                //mostrar mensaje
                const termino = await leerInput('Ciudad: '); 

                //buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //seleccionar el lugar
                const id = await listarLugares(lugares);

                if(id === '0') continue;

                const lugarSel = lugares.find( l=> l.id===id);

                //guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //Paso 3. Datos del clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lgn);

                //paso 4. Mostrar resultados
                console.clear();
                console.log("\nInformacion de la ciudad\n".red);
                console.log("Ciudad: ", lugarSel.nombre.green);
                console.log("Latitud: ", lugarSel.lgn.toString().green);
                console.log("Longitud: ", lugarSel.lat.toString().green);
                console.log("Temperatura: ", clima.temp.toString().green);
                console.log("Minima: ", clima.min.toString().green);
                console.log("Maxima: ", clima.max.toString().green);
                console.log("Como esta el clima: ", clima.desc.green);
        
            break;

            case 2:  
                 busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${ i + 1 }.`.green;
                    console.log(` ${idx} ${lugar}`);
                 });
            break;
 
        }
         
        await pausa();
        
    } while ( opt !== 0);


}

main();