import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import Auxiliary from "util/Auxiliary";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class SidebarContent extends Component {
  getNoHeaderClass = navStyle => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = navStyle => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  render() {
    const { themeType, navStyle, pathname, userPermissions } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split("/")[1];

    const adminView = userPermissions && userPermissions.includes("readUser");
    const roleView = userPermissions && userPermissions.includes("readRole");

    const contestStageView =
      userPermissions && userPermissions.includes("readContestStage");

    const customerView =
      userPermissions &&
      (userPermissions.includes("readCustomer") ||
        userPermissions.includes("readProfile") ||
        userPermissions.includes("readVote") ||
        userPermissions.includes("readTop500"));

    const votesView = userPermissions && userPermissions.includes("readVote");

    const top500View =
      userPermissions && userPermissions.includes("readTop500");

    const top150View =
      userPermissions && userPermissions.includes("readTop150");

    const top75View = userPermissions && userPermissions.includes("readTop75");

    const top30View = userPermissions && userPermissions.includes("readTop30");

    const top20View = userPermissions && userPermissions.includes("readTop20");

    const top10View = userPermissions && userPermissions.includes("readTop10");

    const top5View = userPermissions && userPermissions.includes("readTop05");

    const transactionView =
      userPermissions && userPermissions.includes("readTransaction");

    const newsView = userPermissions && userPermissions.includes("readNews");
    const bannerView =
      userPermissions && userPermissions.includes("readBanner");
    const webinarView =
      userPermissions && userPermissions.includes("readWebinar");
    const competitionView =
      userPermissions && userPermissions.includes("readCompetition");
    const couponView =
      userPermissions && userPermissions.includes("readCoupon");

    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content">
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Menu
              defaultOpenKeys={[defaultOpenKeys]}
              selectedKeys={[selectedKeys]}
              theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
              mode="inline"
            >
              {adminView || roleView ? (
                <SubMenu
                  key="userManagement"
                  className={this.getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-profile2" />
                      <IntlMessages id="sidebar.adminManagement" />
                    </span>
                  }
                >
                  {adminView ? (
                    <Menu.Item key="users">
                      <Link to="/user-management/users">Admins</Link>
                    </Menu.Item>
                  ) : null}

                  {roleView ? (
                    <Menu.Item key="roles">
                      <Link to="/user-management/roles">Roles</Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : null}

              {contestStageView ? (
                <Menu.Item key="contestStagesSwitches">
                  <Link to="/contest/stages">
                    <i className="icon icon-default-timeline" />
                    <span>Contest Stages</span>
                  </Link>
                </Menu.Item>
              ) : null}

              {customerView ||
              transactionView ||
              votesView ||
              top500View ||
              top150View ? (
                <SubMenu
                  key="customerManagement"
                  className={this.getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-profile" />
                      Contestants
                    </span>
                  }
                >
                  {customerView ? (
                    <Menu.Item key="contestants">
                      <Link to="/contestant-management/contestants">
                        Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {votesView ? (
                    <Menu.Item key="votingApproved">
                      <Link to="/contestant-management/voting-approved">
                        Approved for Voting
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top500View ? (
                    <Menu.Item key="top1000">
                      <Link to="/contestant-management/top-1000">
                        Top 1000 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top150View ? (
                    <Menu.Item key="top300">
                      <Link to="/contestant-management/top-300">
                        Top 300 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top75View ? (
                    <Menu.Item key="top150">
                      <Link to="/contestant-management/top-150">
                        Top 150 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top30View ? (
                    <Menu.Item key="top60">
                      <Link to="/contestant-management/top-60">
                        Top 60 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top20View ? (
                    <Menu.Item key="top40">
                      <Link to="/contestant-management/top-40">
                        Top 40 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top10View ? (
                    <Menu.Item key="top20">
                      <Link to="/contestant-management/top-20">
                        Top 20 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {top5View ? (
                    <Menu.Item key="top10">
                      <Link to="/contestant-management/top-10">
                        Top 10 Profiles
                      </Link>
                    </Menu.Item>
                  ) : null}

                  {transactionView ? (
                    <Menu.Item key="transactions">
                      <Link to="/contestant-management/transactions">
                        Transactions
                      </Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : null}

              {newsView ? (
                <Menu.Item key="newsPR">
                  <Link to="/misc/news-and-pr">
                    <i className="icon icon-editor" />
                    <span>News & PR</span>
                  </Link>
                </Menu.Item>
              ) : null}

              {bannerView || webinarView || competitionView || couponView ? (
                <SubMenu
                  key="misc"
                  className={this.getNavStyleSubMenuClass(navStyle)}
                  title={
                    <span>
                      <i className="icon icon-setting" />
                      <IntlMessages id="sidebar.miscellaneous" />
                    </span>
                  }
                >
                  {competitionView ? (
                    <Menu.Item key="competitions">
                      <Link to="/misc/competitions">Competitions</Link>
                    </Menu.Item>
                  ) : null}

                  {webinarView ? (
                    <Menu.Item key="webinars">
                      <Link to="/misc/webinars">Webinars</Link>
                    </Menu.Item>
                  ) : null}

                  {bannerView ? (
                    <Menu.Item key="homeBanners">
                      <Link to="/misc/homeBanners">Home Page Banners</Link>
                    </Menu.Item>
                  ) : null}

                  {couponView ? (
                    <Menu.Item key="coupons">
                      <Link to="/misc/coupons">Coupons</Link>
                    </Menu.Item>
                  ) : null}
                </SubMenu>
              ) : null}
            </Menu>
          </CustomScrollbars>
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};

const mapStateToProps = ({ auth, settings }) => {
  const { navStyle, themeType, locale, pathname } = settings;
  let userPermissions = window.atob(auth.userPermissions);
  return { navStyle, themeType, locale, pathname, userPermissions };
};
export default connect(mapStateToProps)(SidebarContent);
