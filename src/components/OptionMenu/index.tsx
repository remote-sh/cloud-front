import { useCallback, useEffect, useRef, useState } from 'react';
import { useRefStore } from '../../store/ref.store';
import { defaultContainer } from '../../styles/global/container.css';
import { ElementOptionMenu } from './ElementOptionMenu';
import { menuContainer } from '../../styles/menu.css';
import { BackgroundOptionMenu } from './BackgroundOptionMenu';

export const OptionMenu = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const elementsRef = useRefStore((state) => state.elementsRef);
  const menuRef = useRef<HTMLDivElement>(null);
  const setMenuRef = useRefStore((state) => state.setMenuRef);

  const [targetElementKey, setTargetElementKey] = useState('');
  const [menuType, setMenuType] = useState('');

  const handleContextMenu = (e: React.MouseEvent) => {
    const currentMenu = menuRef.current;
    if (currentMenu) {
      e.preventDefault();
      setMenuType('background');
      currentMenu.style.top = `${e.clientY}px`;
      currentMenu.style.left = `${e.clientX}px`;
      if (elementsRef) {
        elementsRef.forEach((element, key) => {
          if (element.current && element.current.contains(e.target as Node)) {
            setTargetElementKey(key);
            setMenuType('element');
          }
        });
      }
      currentMenu.style.display = 'block';
    }
  };

  const closeMenu = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      const currentMenu = menuRef.current;
      if (!currentMenu) return;
      if (e.target !== currentMenu && !currentMenu.contains(e.target as Node)) {
        currentMenu.style.display = 'none';
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuRef(menuRef);
    }
  }, [setMenuRef]);

  return (
    <div className={defaultContainer} onContextMenu={handleContextMenu}>
      {children}
      <div className={menuContainer} ref={menuRef}>
        {menuType === 'element' && (
          <ElementOptionMenu elementKey={targetElementKey} menuRef={menuRef} />
        )}
        {menuType === 'background' && (
          <BackgroundOptionMenu menuRef={menuRef} />
        )}
      </div>
    </div>
  );
};