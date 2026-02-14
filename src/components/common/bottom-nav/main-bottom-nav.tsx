import { BottomNav, MAIN_NAV_CONFIG } from './bottom-nav';

interface MainBottomNavProps {
    items?: typeof MAIN_NAV_CONFIG;
    exclude?: string[];
}

export function MainBottomNav({ items = MAIN_NAV_CONFIG, exclude = [] }: MainBottomNavProps) {
    const filteredItems = items.filter((item) => !exclude.includes(item.to));

    return (
        <BottomNav>
            {filteredItems.map((item) => (
                <BottomNav.Item key={item.to} {...item} />
            ))}
        </BottomNav>
    );
}
