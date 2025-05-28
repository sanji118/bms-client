import React, { useState, useEffect } from 'react';
import {
  getCoupons,
  createCoupon,
  updateCouponStatus,
  deleteCoupon
} from '../utils';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Switch,
  Space,
  Popconfirm,
  DatePicker,
  Select,
  Tag
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      message.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const couponData = {
        ...values,
        validFrom: values.validity[0].format('YYYY-MM-DD'),
        validUntil: values.validity[1].format('YYYY-MM-DD'),
        status: 'active'
      };
      delete couponData.validity;
      
      setLoading(true);
      await createCoupon(couponData);
      message.success('Coupon created successfully');
      setIsModalVisible(false);
      fetchCoupons();
    } catch (error) {
      message.error('Failed to create coupon');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCouponStatus(id, status ? 'active' : 'inactive');
      message.success('Coupon status updated');
      fetchCoupons();
    } catch (error) {
      message.error('Failed to update coupon status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      message.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      message.error('Failed to delete coupon');
    }
  };

  const columns = [
    {
      title: 'Coupon Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount, record) => (
        record.type === 'percentage' ? `${discount}%` : `$${discount}`
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'percentage' ? 'blue' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_, record) => (
        `${record.validFrom} to ${record.validUntil}`
      ),
    },
    {
      title: 'Min Rent',
      dataIndex: 'minRent',
      key: 'minRent',
      render: (minRent) => minRent ? `$${minRent}` : 'None',
    },
    {
      title: 'Applicable For',
      dataIndex: 'applicableFor',
      key: 'applicableFor',
      render: (tags) => (
        <>
          {tags?.map(tag => (
            <Tag color="purple" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this coupon?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCoupon}
        >
          Add Coupon
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Add New Coupon"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[
              { required: true, message: 'Please input the coupon code!' },
              { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
            ]}
          >
            <Input placeholder="e.g., WELCOME10" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Discount Type"
            initialValue="percentage"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="percentage">Percentage</Option>
              <Option value="fixed">Fixed Amount</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount Value"
            rules={[
              { required: true, message: 'Please input the discount value!' },
              { type: 'number', min: 1, message: 'Discount must be at least 1' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              formatter={value => 
                form.getFieldValue('type') === 'percentage' ? `${value}%` : `$${value}`
              }
              parser={value => value.replace(/%|\$/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="validity"
            label="Validity Period"
            rules={[{ required: true, message: 'Please select validity period!' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="minRent"
            label="Minimum Rent Amount"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => `$${value}`}
              parser={value => value.replace(/\$/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="applicableFor"
            label="Applicable For"
            rules={[{ required: true, message: 'Please select at least one option!' }]}
          >
            <Select mode="tags" placeholder="Select or enter tags">
              <Option value="new-members">New Members</Option>
              <Option value="renewals">Renewals</Option>
              <Option value="special-offers">Special Offers</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCoupons;