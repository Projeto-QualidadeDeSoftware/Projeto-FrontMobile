export type UsuarioLogado = {
    id: number,
    nome: string,
    cargo: string
}

export type LoginResponse = {
    token: string,
    tipo: string,
    expiraEm: string,
    funcionario: UsuarioLogado
}
