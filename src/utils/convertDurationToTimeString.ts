//Criada uma function para converter e tratar a informação duration -> ex.: 55748 para (Horas, minutos e segundos)
export function convertDurationToTimeString(duration: number){

    //Match.floor -> pegar o valor abaixo no result
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    //unit -> [hours, minutes, seconds]
    //padStart(2, '0') -> Todo resultado com apenas 1 casa numérica, complementa com "0" à esquerda
    //.join(':') -> concatena com ":" entre os valores
    const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

    return timeString;
}