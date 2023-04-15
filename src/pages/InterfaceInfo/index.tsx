import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, Card, Descriptions, Form, message, Input, Spin, Divider} from 'antd';
import {
  getInterfaceInfoByIdUsingGET, invokeInterfaceInfoUsingPOST,
} from '@/services/api-backend/interfaceInfoController';
import { useParams } from '@@/exports';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="Interface Documentation">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="Status">{data.status ? 'Open' : 'Close'}</Descriptions.Item>
            <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
            <Descriptions.Item label="URL">{data.url}</Descriptions.Item>
            <Descriptions.Item label="Method">{data.method}</Descriptions.Item>
            <Descriptions.Item label="Request Params">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="Request Header">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="response Header">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="Creation Time">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="Update Time">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="Test Online">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="Request Params" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Invoke
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="Return Results" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
