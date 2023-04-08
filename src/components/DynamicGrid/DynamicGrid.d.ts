import React from "react";

export interface DynamicGridTemplateItem {
    minSpace: number,
    fixed: boolean,
    content: React.ReactNode
}

export interface DynamicGridProps {
    direction?: 'vertical' | 'horizontal',
    cells?: DynamicGridTemplateItem[],
    style?: React.CSSProperties,
    onChange?: (layout: number[]) => void,
    children: React.ReactNode[]
}