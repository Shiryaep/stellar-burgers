import { ModalUI } from '@ui';
import { memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import type { TModalProps } from './type';

const modalRoot = document.getElementById('modals');

export const Modal = memo(function Modal({
  title,
  onClose,
  children,
}: TModalProps): React.JSX.Element {
  const { number } = useParams<{ number?: string }>();
  const modifiedTitle = number ? `#${String(number).padStart(6, '0')}` : title;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={modifiedTitle} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
