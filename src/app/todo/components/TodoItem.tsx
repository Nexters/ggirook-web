'use client';

import { FormEvent, useCallback, useRef, useState } from 'react';
import { useDeleteTodo } from '../queries/useDeleteTodo';
import { Button } from '@/shared/components/Button';
import { CheckBox } from '@/shared/components/CheckBox';
import { Modal } from '@/shared/components/Modal';

interface TodoItemProps {
  id: string;
  isFullfilled: boolean;
  content: string;
}

export function TodoItem({ id, isFullfilled, content }: TodoItemProps) {
  const { mutate: deleteTodo } = useDeleteTodo();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const previousContent = useRef(content);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const toggleCheck = () => {
    // TODO: API 호출
    // toggle에 API 호출 너무 자주 일어날려나? API 기다려야하나?
  };

  const handleClickButton = useCallback(() => {
    if (isEditMode) {
      const inputValue = inputRef.current?.value;
      if (inputValue?.length === 0) return;

      // TODO: 수정 로직

      setIsEditMode(false);
      return;
    }

    openModal();
  }, [isEditMode, openModal]);

  const resetInput = useCallback(() => {
    if (!isEditMode) return;
    if (!inputRef.current) return;

    inputRef.current.value = previousContent.current;
    setIsEditMode(false);
  }, [isEditMode]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isEditMode) return;
    },
    [isEditMode],
  );

  return (
    <form className='flex w-full items-start gap-2 py-3' onSubmit={handleSubmit}>
      <CheckBox isChecked={isFullfilled} onClick={() => toggleCheck()} />
      <input
        ref={inputRef}
        className='h-auto grow resize-none overflow-hidden bg-transparent text-title3 leading-[24px] outline-none transition-colors duration-300 focus:bg-grayscale-50'
        defaultValue={content}
        onFocus={() => setIsEditMode(true)}
        onBlur={resetInput}
      />
      <button type='button' className='w-fit shrink-0 text-body1 text-grayscale-700' onClick={handleClickButton}>
        {isEditMode ? '확인' : '삭제'}
      </button>
      {
        <Modal
          isOpen={isOpenModal}
          title='삭제하실건가요?'
          message='삭제한 내용은 되돌릴 수 없어요'
          firstButton={<Button onClick={() => deleteTodo(id)}>확인</Button>}
          secondButton={
            <Button color='secondary' onClick={() => closeModal()}>
              취소
            </Button>
          }
          close={() => closeModal()}
        />
      }
    </form>
  );
}
