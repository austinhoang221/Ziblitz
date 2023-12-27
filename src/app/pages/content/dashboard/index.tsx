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
      <Row gutter={36} className="mt-4">
        <Col span={8}>
          <Card>
            <div
              className="text-center d-flex-direction-column d-flex"
              style={{ height: "400px" }}
            >
              <Avatar
                size={128}
                src={user?.avatarUrl + sasToken}
                className="mr-auto ml-auto mb-2"
              />
              <h2 className="font-weight-medium">{user?.name}</h2>
              <span className="text-muted mt-2 mb-2">ABOUT</span>

              {user?.jobTitle && (
                <>
                  <i className="fa-solid fa-suitcase mr-2"></i>
                  <span>{user?.jobTitle}</span>
                </>
              )}

              {user?.organization && (
                <>
                  <i className="fa-solid fa-sitemap mr-2"></i>
                  <span>{user?.organization}</span>
                </>
              )}
              {user?.location && (
                <>
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  <span>{user?.location}</span>
                </>
              )}

              <span className="text-muted mt-2 mb-2">CONTACT</span>
              {user?.email && (
                <span className="align-center">
                  <i className="fa-regular fa-envelope mr-2"></i>
                  <span>{user?.email}</span>
                </span>
              )}
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <IssueTable></IssueTable>
        </Col>
      </Row>
      <Row className="mt-4" gutter={36}>
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
