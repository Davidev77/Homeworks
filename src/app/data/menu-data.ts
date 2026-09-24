import { MenuNode, MenuTree } from '../models/menu-node';

export function buildMenuTree(): MenuTree {
  const tree = new MenuTree();

  const profile = new MenuNode('Profile', {
    link: '/profile',
    component: 'ProfileComponent',
  });

  const messages = new MenuNode('Messages', {
    link: '/messages',
    component: 'MessagesComponent',
  });

  const settings = new MenuNode('Settings').addChild(
    new MenuNode('Account', {
      link: '/settings/account',
      component: 'AccountComponent',
    }),
    new MenuNode('Profile', {
      link: '/settings/profile',
      component: 'SettingsProfileComponent',
    }),
    new MenuNode('Security & Privacy', {
      link: '/settings/security',
      component: 'SecurityPrivacyComponent',
    }),
    new MenuNode('Password', {
      link: '/settings/password',
      component: 'PasswordComponent',
    }),
    new MenuNode('Notification', {
      link: '/settings/notification',
      component: 'NotificationComponent',
    }),
  );

  const help = new MenuNode('Help').addChild(
    new MenuNode("FAQ's", { link: '/help/faqs', component: 'FaqsComponent' }),
    new MenuNode('Submit a Ticket', {
      link: '/help/ticket',
      component: 'SubmitTicketComponent',
    }),
    new MenuNode('Network Status', {
      link: '/help/status',
      component: 'NetworkStatusComponent',
    }),
  );

  const logout = new MenuNode('Logout', {
    link: '/logout',
    component: 'LogoutComponent',
  });

  tree.addTopLevel(profile, messages, settings, help, logout);

  return tree;
}
