import { ref } from 'vue';

export default function useModal(): any {

  const content = ref<HTMLDivElement | null>(null);
  const focusElement = ref<HTMLDivElement | null>(null);
  const toggleBtn = ref<HTMLDivElement | null>(null);

  const isOn = (): boolean => {
    if (content.value) {
      return content.value.offsetHeight > 0;
    }
    return false;
  };

  const open = (): void => {
    if (!isOn() && toggleBtn.value) {
      toggleBtn.value.click();
      if (focusElement.value) {
        focusElement.value.focus();
      }
    }
  };

  const close = (): void => {
    if (isOn() && focusElement.value) {
      focusElement.value.click();
    }
  };

  return {content, focusElement, toggleBtn, isOn, open, close};

}
