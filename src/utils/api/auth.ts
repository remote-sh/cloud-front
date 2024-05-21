import axios from 'axios';
import { api } from '../config';
import { Urls } from '../../types/request';
import { IProfile } from '../../types/response';

const authUrls: Urls = {
  validate: {
    url: `${api.auth}/token/valid`,
    method: 'GET',
  },
  refresh: {
    url: `${api.auth}/token/refresh`,
    method: 'GET',
  },
  issue: {
    url: `${api.auth}/token/issue`,
    method: 'GET',
  },
  profile: {
    url: `${api.auth}/user/profile`,
    method: 'GET',
  },
};

export const isValid = (accessToken: string) => {
  return axios.request({
    method: authUrls.validate.method,
    url: authUrls.validate.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const refresh = (accessToken: string) => {
  return axios.request({
    method: authUrls.refresh.method,
    url: authUrls.refresh.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
};

export const issue = async (code: string) => {
  const response = await axios.request({
    method: authUrls.issue.method,
    url: `${authUrls.issue.url}?code=${code}`,
    withCredentials: true,
  });
  return response;
};

export const getProfile = (accessToken: string) => {
  return axios.request<{
    message: string;
    data: IProfile;
  }>({
    method: authUrls.profile.method,
    url: authUrls.profile.url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
