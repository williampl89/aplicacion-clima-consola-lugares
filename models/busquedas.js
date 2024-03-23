import axios from 'axios';
import * as fs from 'fs';
import 'dotenv/config'

class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');

        });
    }

    get paramsMapbox(){
        return {
            'proximity': 'ip',
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric',   
        }
    }

    async ciudad(lugar = ''){
        

        try {
            //peticion http
            //console.log('Ciudad', lugar);

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lgn: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }

        
        return []; // regresa arreglo con todas las ciudades
    }

    async climaLugar(lat, lon){

        try {

        
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });

            const resp = await instance.get();
            const { weather, main } = resp.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            
        }

    }

    agregarHistorial( lugar = '' ){

        //todo: evitar duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());
        

        //grabar en un archivo de texto
        this.guardarDB();

    }


    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));

    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }

}

export default Busquedas
