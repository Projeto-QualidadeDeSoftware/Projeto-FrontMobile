import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Produto } from '../models/Produto';

export type NomeIcone = ComponentProps<typeof Ionicons>['name'];

export function iconeDoProduto(produto: Produto): NomeIcone {
    const { nome, descricao } = produto;
    const texto = `${nome} ${descricao}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    if (texto.includes('cafe') || texto.includes('cappuccino')) {
        return 'cafe-outline';
    }

    if (
        texto.includes('bebida') ||
        texto.includes('refrigerante') ||
        texto.includes('agua') ||
        texto.includes('suco') ||
        texto.includes('cha')
    ) {
        return 'water-outline';
    }

    if (texto.includes('sorvete') || texto.includes('picole')) {
        return 'ice-cream-outline';
    }

    if (texto.includes('chocolate') || texto.includes('doce') || texto.includes('bala')) {
        return 'nutrition-outline';
    }

    if (texto.includes('pizza')) {
        return 'pizza-outline';
    }

    if (
        texto.includes('salada') ||
        texto.includes('fruta') ||
        texto.includes('natural')
    ) {
        return 'leaf-outline';
    }

    if (
        texto.includes('coxinha') ||
        texto.includes('salgado') ||
        texto.includes('pao') ||
        texto.includes('esfirra') ||
        texto.includes('hamburguer') ||
        texto.includes('lanche')
    ) {
        return 'fast-food-outline';
    }

    return 'restaurant-outline';
}
