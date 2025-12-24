import { addMenu, menu_update } from '@/api/user';
import FModalForm from '@/components/modal-form';
import { Menu, MenuType } from '@/types/menu';
import { antdUtils } from '@/utils/antd';
import { t } from '@/utils/i18n';
import { componentPaths } from '@/utils/pages';
import { clearFormValues } from '@/utils/utils';
import { useRequest } from 'ahooks';
import { Form, Input, InputNumber, Radio, Select, Switch, TreeSelect } from 'antd';
import React, { useEffect, useMemo } from 'react';

interface CreateMenuProps {
  visible: boolean;
  onCancel: (flag?: boolean) => void;
  curRecord?: Menu | null;
  editData?: Menu | null;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: () => void;
}


function NewAndEditMenuForm({
  visible,
  curRecord,
  editData,
  onOpenChange,
  onSaveSuccess,
}: CreateMenuProps) {

  const [form] = Form.useForm();

  //   const { data: apiData, run: getApiList } = useRequest(api_apiList, { manual: true });
  //   const { runAsync: getAllocApis } = useRequest(menu_getAllocAPIByMenu, { manual: true });
  //   const { run: addMenu, loading: createLoading } = useRequest(menu_create, {
  //     manual: true,
  //     onSuccess: () => {
  //       antdUtils.message?.success(t("kKvCUxII" /* 新增成功 */));
  //       onSaveSuccess()
  //     },
  //   });

    const { run: updateMenu, loading: updateLoading } = useRequest(menu_update, {
      manual: true,
      onSuccess: () => {
        antdUtils.message?.success(t("XLSnfaCz" /* 更新成功 */));
        onSaveSuccess()
      },
    });

  useEffect(() => {
    if (visible) {
      //getApiList();
      setDefaultFormValues();
    }
  }, [visible]);

  useEffect(() => {
    if (!editData) {
      clearFormValues(form);
    } else {
      form.setFieldsValue({
        ...editData,
      });
    }
  }, [editData])

  async function setDefaultFormValues() {
    if (editData?.id) {
      form.setFieldsValue(editData);
      // const [error, allocApis] = await to(getAllocApis({ menuId: editData.id }));
      // if (!error) {
      //   form.setFieldValue('apis', allocApis.map((api) => [api.method, api.path].join('~')))
      // }
    } else if (curRecord) {
      form.setFieldsValue({
        show: true,
        type: 1,
      })
    } else {
      form.setFieldsValue({
        show: true,
        type: 1,
      })
    }
  }

  function titleRender(record: { type?: string, title?: string, method?: string }) {
    if (record.type === 'controller') {
      return <div>{record.title}</div>;
    }

    const colorMap: Record<string, string> = {
      get: '#00FA9A',
      post: '#FF8C00',
      put: '#00BFFF',
      delete: '#DC143C',
    };

    return (
      <div>
        <span>{record.title}</span>
        <span
          style={{ color: colorMap[record.method || ''] }}
          className="ml-8px inline-block w-60px"
        >
          {String(record.method).toUpperCase()}
        </span>
      </div>
    );
  }

  // const formatApi = useMemo(() => {
  //   return (apiData || []).map((item: any) => ({
  //     value: item.path,
  //     label: titleRender(item),
  //     type: item.type,
  //     children: item.children?.map((o: any) => ({
  //       value: `${o.method}~${item.prefix}${(o.path === '/' ? '' : o.path)}`,
  //       label: titleRender(o),
  //       type: o.type,
  //       method: o.method,
  //       path: item.prefix + (o.path === '/' ? '' : o.path),
  //     })),
  //   }));
  // }, [apiData]);

  const save = async (values: any) => {
    const formData: any = values;

    formData.parentId = curRecord?.id || null;

    if (values.type === MenuType.Catalog) {
      formData.show = true;
    } else if (values.type === MenuType.Button) {
      formData.show = false;
    }

    // formData.apis = (values.apis || []).map((api: string) => {
    //   const [method, path] = api.split('~');
    //   return {
    //     method,
    //     path,
    //   }
    // });
    if (editData) {
      formData.parentId = editData.parentId;
      formData.id = editData.id;
      updateMenu(formData)
    } else {
      addMenu(formData);
    }
  }

  const renderDirectoryForm = () => {
    return (
      <>
        <Form.Item
          label={t("qvtQYcfN" /* 名称 */)}
          name="title"
          rules={[{
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("ESYcSMBi" /* 图标 */)} name="icon">

        </Form.Item>
        <Form.Item
          tooltip={t("fQwvzwUN" /* 以/开头，不用手动拼接上级路由。参数格式/:id */)}
          label={t("XBkSjYmn" /* 路由 */)}
          name="path"
          rules={[{
            pattern: /^\//,
            message: t("GlfSFNdD" /* 必须以/开头 */),
          }, {
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("XRfphTtu" /* 排序号 */)} name="order">
          <InputNumber />
        </Form.Item>
      </>
    )
  }

  const renderMenuForm = () => {
    return (
      <>
        <Form.Item
          rules={[{
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
          label={t("qvtQYcfN" /* 名称 */)}
          name="title"
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("ESYcSMBi" /* 图标 */)} name="icon">
          {/* <Select>
            {Object.keys(antdIcons).map((key) => (
              <Select.Option key={key}>{React.createElement(antdIcons[key])}</Select.Option>
            ))}
          </Select > */}
          <Input />
        </Form.Item>
        <Form.Item
          tooltip={t("SOYRkwDk" /* 以/开头，不用手动拼接上级路由。参数格式/:id */)}
          label={t("XBkSjYmn" /* 路由 */)}
          name="path"
          rules={[{
            pattern: /^\//,
            message: t("ZsOhTupE" /* 必须以/开头 */),
          }, {
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
          label={t("aqmTtwBN" /* 文件地址 */)}
          name="filePath"
        >
          <Select
            options={componentPaths.map(path => ({
              label: path,
              value: path,
            }))}
          />
        </Form.Item>
        <Form.Item valuePropName="checked" label={t("kDeoPsVD" /* 是否显示 */)} name="show">
          <Switch />
        </Form.Item>
        <Form.Item label={t("XRfphTtu" /* 排序号 */)} name="order">
          <InputNumber />
        </Form.Item>
      </>
    )
  }


  const renderButtonForm = () => {
    return (
      <>
        <Form.Item
          rules={[{
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
          label={t("qvtQYcfN" /* 名称 */)}
          name="title"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{
            required: true,
            message: t("QFkffbad" /* 不能为空 */),
          }]}
          label={t("etRQPYBn" /* 权限代码 */)}
          name="authCode"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("LxiWbxsx" /* 绑定接口 */)}
          name="apis"
        >
          {/* <TreeSelect maxTagCount={3} treeCheckable treeData={formatApi} /> */}
        </Form.Item>
      </>
    )
  }


  const renderFormMap = {
    [MenuType.Catalog.toString()]: renderDirectoryForm,
    [MenuType.Menu.toString()]: renderMenuForm,
    [MenuType.Button.toString()]: renderButtonForm,
  }

  return (
    <FModalForm
      open={visible}
      title={editData ? t('wXpnewYo' /* 编辑 */) : t('VjwnJLPY' /* 新建 */)}
      width={640}
      form={form}
      onFinish={save}
      labelCol={{ flex: '0 0 100px' }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      onOpenChange={onOpenChange}
      //loading={createLoading || updateLoading}
      modalProps={{ forceRender: true }}
    >
      <Form.Item label={t("ToFVNEkU" /* 类型 */)} name="type">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
        >
          {curRecord?.type !== 1 && (
            <Radio value={1}>{t("wuePkjHJ" /* 目录 */)}</Radio>
          )}
          <Radio value={2}>{t("mYuKCgjM" /* 菜单 */)}</Radio>
          <Radio value={3}>{t("ZJvOOWLP" /* 按钮 */)}</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => renderFormMap[form.getFieldValue('type') as string]?.()}
      </Form.Item>
    </FModalForm>
  )
}

export default NewAndEditMenuForm;