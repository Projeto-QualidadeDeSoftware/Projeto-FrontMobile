export function formatarMoeda(valor: number | null | undefined) {
    if (valor === null || valor === undefined) {
        return 'Não informado';
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return 'Não informado';
    }

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export function formatarData(data: string) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}
