import * as React from 'react';

import { DefaultButton, Modal, mergeStyleSets } from 'office-ui-fabric-react';

import { ModalHeader } from './Modal/ModalHeader';
import { ModalContent } from './Modal/ModalContent';
import { ModalBottom } from './Modal/ModalBottom';

import { useBoolean } from '@uifabric/react-hooks';

require('./MockupForm.css');

const contentStyles = mergeStyleSets({
  modal: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  }
});

export const MockupForm: React.FunctionComponent = () => {

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(true);

    return (
      <div>
        <Modal isOpen={isModalOpen} className="{contentStyles.modal} mainModal">          
          <ModalHeader/>
          <ModalContent/>  
          <ModalBottom/>        
        </Modal>
      </div>
    );
};