import { Avatar, Card, Col, Row } from "antd";
import "./index.scss";
import SprintChart from "./sprint-chart";
import ProjectChart from "./project-chart";
import IssueTable from "./issue-table";
import { sasToken } from "../../../helpers";
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")!);
  return (
    <>
      <Row gutter={18} className="mt-2">
        <Col span={8}>
          <Card>
            <div
              className="text-center d-flex-direction-column d-flex"
              style={{ height: "335px" }}
            >
              <Avatar
                size={70}
                src={user?.avatarUrl + sasToken}
                className="mr-auto ml-auto mb-2"
              />
              <h2 className="font-weight-medium">{user?.name}</h2>
              <span className="text-muted mt-2 mb-2">ABOUT</span>
              <div className="ml-5 mr-5">
                {user?.jobTitle && (
                  <Row>
                    <Col span={2}>
                      <i className="fa-solid fa-suitcase mr-2"></i>
                    </Col>
                    <Col span={22}>
                      <span className="text-left">{user?.jobTitle}</span>
                    </Col>
                  </Row>
                )}

                {user?.organization && (
                  <Row>
                    <Col span={2}>
                      <i className="fa-solid fa-sitemap mr-2"></i>
                    </Col>
                    <Col span={22}>
                      <span>{user?.organization}</span>
                    </Col>
                  </Row>
                )}
                {user?.location && (
                  <Row>
                    <Col span={2}>
                      <i className="fa-solid fa-location-dot mr-2"></i>
                    </Col>
                    <Col span={22}>
                      <span>{user?.location}</span>
                    </Col>
                  </Row>
                )}

                <span className="text-muted mt-2 mb-2">CONTACT</span>
                {user?.email && (
                  <Row>
                    <Col span={2}>
                      <i className="fa-regular fa-envelope mr-2"></i>
                    </Col>
                    <Col span={22}>
                      <span>{user?.email}</span>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <IssueTable></IssueTable>
        </Col>
      </Row>
      <Row className="mt-2" gutter={18}>
        <Col span={8}>
          <ProjectChart></ProjectChart>
        </Col>
        <Col span={16}>
          <SprintChart></SprintChart>
        </Col>
      </Row>
    </>
  );
}
