/**
 * <Menu> block — Kajabi `menu` type.
 */
import type { BlockComponent } from '../types';
import { getBlockChromeStyle, type ChromeProps } from '../blockChrome';

export interface MenuItem {
  label: string;
  url: string;
}

export interface MenuProps extends ChromeProps {
  handle?: string;
  alignment?: 'left' | 'center' | 'right';
  stretch?: boolean;
  previewItems?: MenuItem[];
}

export const Menu: BlockComponent<MenuProps> = (props) => {
  const items: MenuItem[] = props.previewItems ?? [
    { label: 'Home', url: '#' },
    { label: 'Features', url: '#' },
    { label: 'Pricing', url: '#' },
    { label: 'About', url: '#' },
  ];
  const justify =
    props.alignment === 'left' ? 'flex-start' :
    props.alignment === 'center' ? 'center' : 'flex-end';
  const chrome = getBlockChromeStyle(props);
  return (
    <nav style={{
      display: 'flex',
      gap: 24,
      justifyContent: justify,
      alignItems: 'center',
      flex: props.stretch === false ? '0 0 auto' : 1,
      ...chrome,
    }}>
      {items.map((item) => (
        <a key={item.label} href={item.url} style={{ color: 'inherit', textDecoration: 'none', fontSize: 14 }}>
          {item.label}
        </a>
      ))}
    </nav>
  );
};

Menu.kajabiType = 'menu';
Menu.allowedIn = ['header', 'footer'];
Menu.serialize = (p) => ({
  menu: p.handle ?? 'main-menu',
  alignment: p.alignment ?? 'right',
  stretch: p.stretch === false ? 'false' : 'true',
});
