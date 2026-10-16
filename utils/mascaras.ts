export function somenteNumeros(texto: string, limite?: number) {
    const numeros = texto.replace(/\D/g, '');
    return limite === undefined ? numeros : numeros.slice(0, limite);
}

export function aplicarMascaraCpf(texto: string) {
    const numeros = somenteNumeros(texto, 11);

    return numeros
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function aplicarMascaraTelefone(texto: string) {
    const numeros = somenteNumeros(texto, 11);

    if (numeros.length <= 10) {
        return numeros
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}
