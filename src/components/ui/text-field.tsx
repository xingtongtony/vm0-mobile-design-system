import { IconSearch, IconX } from '@tabler/icons-react-native';
import { useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';
import { useIconColors } from '@/hooks/use-tokens';

/** VM0 TextField — 镜像 Figma「Text Field」(h=52,px-16,body 17,grouped 行内样式);
 *  另提供 standalone 变体(描边独立框)与 SearchField(fill 底搜索框)。 */

export interface TextFieldProps extends TextInputProps {
  label?: string;
  helper?: string;
  variant?: 'grouped' | 'standalone';
  className?: string;
}

export function TextField({
  label,
  helper,
  variant = 'standalone',
  className = '',
  ...rest
}: TextFieldProps) {
  const c = useIconColors();
  const box =
    variant === 'grouped'
      ? 'h-[52px] px-4'
      : 'h-11 rounded-lg border border-separator bg-bg px-4';
  return (
    <View className={className}>
      {label ? (
        <Text variant="footnote" weight="medium" color="secondary" className="pb-1.5">
          {label}
        </Text>
      ) : null}
      <View className={`justify-center ${box}`}>
        <TextInput
          className="font-sans text-body leading-[20px] text-label"
          placeholderTextColor={c.labelTertiary}
          {...rest}
        />
      </View>
      {helper ? (
        <Text variant="caption1" color="tertiary" className="pt-1.5">
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

export interface SearchFieldProps extends TextInputProps {
  className?: string;
}

export function SearchField({ className = '', value, onChangeText, ...rest }: SearchFieldProps) {
  const c = useIconColors();
  const [inner, setInner] = useState('');
  const text = value ?? inner;
  const setText = (t: string) => {
    setInner(t);
    onChangeText?.(t);
  };
  return (
    <View className={`h-9 flex-row items-center gap-2 rounded-[10px] bg-fill-3 px-3 ${className}`}>
      <Icon icon={IconSearch} size="sm" color="tertiary" />
      <TextInput
        className="flex-1 font-sans text-body leading-[20px] text-label"
        placeholder="Search"
        placeholderTextColor={c.labelTertiary}
        value={text}
        onChangeText={setText}
        {...rest}
      />
      {text.length > 0 ? (
        <Pressable onPress={() => setText('')} hitSlop={8} className="active:opacity-60">
          <Icon icon={IconX} size="xs" color="tertiary" />
        </Pressable>
      ) : null}
    </View>
  );
}
