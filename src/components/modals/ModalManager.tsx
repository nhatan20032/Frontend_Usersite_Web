import React from 'react';
import { CreateEventModal } from './CreateEventModal';
import { EventDetailModal } from './EventDetailModal';
import { CheckoutModal } from './CheckoutModal';
import { LimitModal } from './LimitModal';
import { SettingsModal } from './SettingsModal';

export const ModalManager: React.FC = () => {
  return (
    <>
      <CreateEventModal />
      <EventDetailModal />
      <CheckoutModal />
      <LimitModal />
      <SettingsModal />
    </>
  );
};
