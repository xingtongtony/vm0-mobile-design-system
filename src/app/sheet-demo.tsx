import { IconBell, IconLink, IconMessage } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Icon, ListGroup, ListRow, Text } from '@/components/ui';

/** 原生 Sheet 内容(iOS:系统 formSheet 提供材质/圆角/grabber/手势,
 *  这里只放 token 化的内容层)。 */

function Tile({ icon, bg }: { icon: Parameters<typeof Icon>[0]['icon']; bg: string }) {
  return (
    <View className={`h-[30px] w-[30px] items-center justify-center rounded-md ${bg}`}>
      <Icon icon={icon} size={17} color="onTint" />
    </View>
  );
}

export default function SheetDemo() {
  return (
    <View className="flex-1 bg-bg-elevated pt-5">
      <View className="gap-4 px-4">
        <View className="items-center">
          <Text variant="headline">分享到</Text>
        </View>
        <ListGroup>
          <ListRow title="信息" disclosure onPress={() => {}} leading={<Tile icon={IconMessage} bg="bg-success" />} />
          <ListRow title="邮件" disclosure onPress={() => {}} leading={<Tile icon={IconBell} bg="bg-link" />} />
          <ListRow
            title="拷贝链接"
            role="button"
            onPress={() => router.back()}
            leading={<Tile icon={IconLink} bg="bg-tint" />}
          />
        </ListGroup>
        <Button variant="bordered" title="Cancel" onPress={() => router.back()} />
      </View>
    </View>
  );
}
