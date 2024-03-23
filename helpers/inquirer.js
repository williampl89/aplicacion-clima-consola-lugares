import inquirer from 'inquirer';
import colors from 'colors';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.red} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.red} Historial`
            },
            {
                value: 0,
                name: `${'0.'.red} Salir`
            }
        ]
    }
]

const inquirerMenu = async() =>{
    console.clear();
    console.log('=============================='.red);
    console.log('    Seleccione una opcion '.white);
    console.log('==============================\n'.red);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;

}

const pausa = async() =>{
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.blue} para continuar`,
        }
    ];
    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async(message) =>{
    const question = [
        {
            type: "input",
            name: "desc",
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares = []) =>{
    const choices = lugares.map( (lugar, i) =>{

        const idx = `${i + 1}.`.green;
        return{
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]
    const {id} = await inquirer.prompt(preguntas);
    return id;
}


const confirmar = async(message) =>{
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;
}

export {inquirerMenu, pausa, leerInput, listarLugares, confirmar};