import { useEffect, useState } from 'react';
import BasePageContainer from '../layout/PageContainer';
import {
  Avatar,
  BreadcrumbProps,
  Button,
  Card,
  Col,
  List,
  Progress,
  Rate,
  Row,
  Spin,
  Table,
  Tag,
} from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { Store } from 'react-notifications-component';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import axios from 'axios';
import Icon from '@ant-design/icons';
import { BiCommentDetail, BiPhotoAlbum } from 'react-icons/bi';
import { MdOutlineArticle, MdOutlinePhoto } from 'react-icons/md';
import { StatisticCard } from '@ant-design/pro-components';
import LazyImage from '../lazy-image';
import { User } from '../../interfaces/models/user';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse } from '../../utils';
import { Review } from '../../interfaces/models/review';
import { ImSpinner2 } from 'react-icons/im';

export const baseURL = `https://spam-mailer-api.vercel.app/api`;

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [isSendingLoading, setIsSendingLoading] = useState(false);
  const [messagesIds, setMessagesIds] = useState([]);
  const [isDashboardloading, setIsDashboardLoading] = useState(false);

  const getDashoardData = async () => {
    setLoading(true);
    // setIsDashboardLoading(true);
    try {
      const data = await axios.get(`${baseURL}/mail/spam`);
      const messagesData = await axios.get(`${baseURL}/mail/messages`);
      setMessagesIds(messagesData?.data?.messages);
      setDashboardData(data.data);
    } catch (error) {
    } finally {
      // setIsDashboardLoading(false);
      setLoading(false);
    }
  };

  const sendReplies = async () => {
    try {
      setIsSendingLoading(true);
      // const borderCountr = await Promise.all(
      //   messagesIds.map(async (message: any) => {
      //     const data = await axios.post(
      //       `${baseURL}/mail/send-message/${message?.id}`
      //     );
      //     console.log(data);
      //     // if(data.status)
      //     // await getDashoardData();
      //     if (data.status === 200) {
      //       Store.addNotification({
      //         title: 'Success!',
      //         message: 'All Messages have been replied.',
      //         type: 'success',
      //         insert: 'top',
      //         container: 'top-right',
      //         animationIn: ['animate__animated', 'animate__fadeIn'],
      //         animationOut: ['animate__animated', 'animate__fadeOut'],
      //         dismiss: {
      //           duration: 5000,
      //           onScreen: true,
      //         },
      //       });
      //     } else {
      //       Store.addNotification({
      //         title: 'Failed!',
      //         message: 'Unexpected error occured.',
      //         type: 'danger',
      //         insert: 'top',
      //         container: 'top-right',
      //         animationIn: ['animate__animated', 'animate__fadeIn'],
      //         animationOut: ['animate__animated', 'animate__fadeOut'],
      //         dismiss: {
      //           duration: 5000,
      //           onScreen: true,
      //         },
      //       });
      //     }
      //   })
      // );
      fetchDataSequentially(messagesIds);
    } catch (error) {
      Store.addNotification({
        title: 'Failed!',
        message: 'Unexpected error occured.',
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    } finally {
      // setIsSendingLoading(false);
    }
  };

  async function fetchDataSequentially(ids: any) {
    setIsSendingLoading(true);
    let iterator = 0;
    try {
      for (const id of ids) {
        iterator++;
        const data = await axios.post(`${baseURL}/mail/send-message/${id?.id}`);
        // if(data.status)
        // await getDashoardData();
        if (data.status === 200) {
          const headers = data?.data?.payload?.headers;
          const fromHeader = headers?.find(
            (header: any) => header.name === 'From'
          );
          Store.addNotification({
            title: 'Success!',
            message: `Message sent to ${fromHeader?.value}`,
            type: 'success',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        } else if (data.status === 205) {
          Store.addNotification({
            title: 'Success!',
            message: `Skipped beacuse recipent doesnt support reply.`,
            type: 'warning',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        } else {
          Store.addNotification({
            title: 'Failed!',
            message: 'Unexpected error occured.',
            type: 'danger',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
        if (iterator === ids.length) {
          setIsSendingLoading(false);
        }
      }
    } catch (error) {
      setIsSendingLoading(false);
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getDashoardData();
  }, []);

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Spam Emails"
            number={dashboardData?.spam?.messagesTotal}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Unread Spam Emails"
            number={dashboardData?.spam?.messagesUnread}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiPhotoAlbum} />}
            title="Success Rate"
            number={'98%'}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlinePhoto} />}
            title="Total Inbox Mails"
            number={dashboardData?.inbox?.messagesTotal}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          xl={18}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card size="default" bordered={false} style={{ padding: '18px 0' }}>
            Use this to send replies and get latest data
            <Button
              onClick={sendReplies}
              style={{ marginRight: '20px', marginLeft: '20px' }}
              // disabled={
              //   dashboardData?.spam?.messagesUnread === 0 ||
              //   dashboardData?.spam?.messagesUnread === null ||
              //   dashboardData?.spam?.messagesUnread === undefined ||
              //   isNaN(dashboardData?.spam?.messagesUnread)
              // }
            >
              {isSendingLoading ? (
                <Spin
                  size="default"
                  indicator={<ImSpinner2 className="icon-spin" />}
                />
              ) : (
                'Send Replies'
              )}
            </Button>
            <Button onClick={getDashoardData}>
              {' '}
              {loading || isSendingLoading ? (
                <Spin
                  size="default"
                  indicator={<ImSpinner2 className="icon-spin" />}
                />
              ) : (
                'Refresh Data '
              )}
            </Button>
          </Card>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default Dashboard;
