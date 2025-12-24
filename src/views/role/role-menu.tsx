import { getMenusByRoleId, getmenutree, role_allocMenu } from '@/api/user';
import { Menu, MenuType } from '@/types/menu';
import { antdUtils } from '@/utils/antd';
import { t } from '@/utils/i18n';
import { Modal, Radio, Spin, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
// import to from 'await-to-js';
import { Key, useEffect, useState } from 'react';

interface RoleMenuProps {
  visible: boolean;
  onCancel: () => void;
  roleId?: string | null;
  onSave?: (checkedKeys: string[]) => void;
}

interface CheckNode {
  key: Key;
  children?: CheckNode[];
}

function RoleMenu({
  visible,
  onCancel,
  roleId,
  onSave
}: RoleMenuProps) {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectType, setSelectType] = useState<"allChildren" | "current" | "firstChildren">('allChildren');

  const getAllChildrenKeys = (children: CheckNode[] = [], keys: Key[]): void => {
    (children || []).forEach((node) => {
      keys.push(node.key);
      getAllChildrenKeys(node.children, keys);
    });
  };

  const getFirstChildrenKeys = (children: CheckNode[] = [], keys: string[]): void => {
    (children || []).forEach((node) => {
      keys.push(node.key as string);
    });
  };

  const onCheck = (_: Key[] | { checked: Key[]; halfChecked: Key[]; }, { checked, node }: { checked: boolean, node: CheckNode }) => {
    const keys = [node.key as string];
    if (selectType === 'allChildren') {
      getAllChildrenKeys(node.children, keys);
    } else if (selectType === 'firstChildren') {
      getFirstChildrenKeys(node.children, keys);
    }

    if (checked) {
      setCheckedKeys((prev) => [...prev, ...keys]);
    } else {
      setCheckedKeys((prev) => prev.filter((o) => !keys.includes(o)));
    }
  };

  const formatTree = (roots: Menu[] = []): DataNode[] => {
    return roots?.map((node) => {
      return {
        key: node.id,
        title: node.title,
        children: formatTree(node.children),
      } as DataNode;
    });
  };

  const getData = async () => {
    setGetDataLoading(true);
    const data = await getmenutree();

    if (data.data) {

      const treedata = formatTree(data.data)
      setTreeData(treedata);
    }

    setGetDataLoading(false);
  };

  const getCheckedKeys = async () => {
    if (!roleId) return;
    const data = await getMenusByRoleId(roleId)
    const ids = data.data || []
    setCheckedKeys(ids);
  };

  const save = async () => {
    if (onSave) {
      onSave(checkedKeys);
      return;
    }

    if (!roleId) return;
    setSaveLoading(true);
    const data = await role_allocMenu(checkedKeys, roleId)

    setSaveLoading(false);

    if (data.status == 200) {
      antdUtils.message?.success(t("koENLxye" /* 分配成功 */));
      onCancel();
    }
  };

  useEffect(() => {
    if (visible) {
      getData();
      getCheckedKeys();
    } else {
      setCheckedKeys([]);
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={t("DvINURho" /* 分配菜单 */)}
      onCancel={() => {
        onCancel();
      }}
      width={640}
      onOk={save}
      confirmLoading={saveLoading}
      styles={{
        body: {
          height: 400,
          overflowY: 'auto',
          padding: '20px 0',
        }
      }}
    >
      {getDataLoading ? (
        <Spin />
      ) : (
        <div>
          <label>{t("oewZmYWL" /* 选择类型： */)}</label>
          <Radio.Group
            onChange={(e) => setSelectType(e.target.value)}
            defaultValue="allChildren"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio value="allChildren">{t("dWBURdsX" /* 所有子级 */)}</Radio>
            <Radio value="current">{t("REnCKzPW" /* 当前 */)}</Radio>
            <Radio value="firstChildren">{t("dGQCFuac" /* 一级子级 */)}</Radio>
          </Radio.Group>
          <div className="mt-16px">
            <Tree
              checkable
              onCheck={onCheck}
              treeData={treeData}
              checkedKeys={checkedKeys}
              checkStrictly
              className='py-[10px]'
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default RoleMenu;
