import React, { useEffect, useState } from "react";
import { Badge, Button, Calendar, List, message, Modal, Space } from "antd";
import axios from "axios";
import VirtualList from "rc-virtual-list";
import PropTypes from "prop-types";

DisplayCours.propTypes = {
	idAdh: PropTypes.number,
};

export default function DisplayCours({ idAdh }) {
	const [courseData, setCourseData] = useState({});
	const [isModalOpened, setIsModalOpened] = useState(false);
	const [modalData, setModalData] = useState([]);
	const ContainerHeight = 400;

	const transformCourses = (courses) => {
		const transformedData = {};
		courses.forEach((course) => {
			const date = new Date(course.datetime).toDateString();
			if (!transformedData[date]) {
				transformedData[date] = [];
			}
			transformedData[date].push({
				type: "success",
				cours: course.nomCours,
				id: course.idCours,
				prenomProf: course.prenomProfesseur,
				nomProf: course.nomProfesseur,
				registeredMembers: course.registeredMembers,
			});
		});
		return transformedData;
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get(
					"http://127.0.0.1/badminton/src/PHP/cours.php"
				);
				const transformedCourses = transformCourses(response.data);
				setCourseData(transformedCourses);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des données des cours :",
					error
				);
			}
		};
		fetchCourses();
	}, []);

	const reserveCourse = async (idCours, idAdherent) => {
		try {
			const response = await axios.post(
				"http://127.0.0.1/badminton/src/PHP/reserver-cours.php",
				{
					idCours: idCours,
					idAdh: idAdherent,
				}
			);

			if (response.data.status === "success") {
				message.success(response.data.message);
			} else if (response.data.status === "error") {
				message.error(response.data.message);
			}
		} catch (error) {
			console.error("Erreur lors de la réservation du cours :", error);
			message.error("Erreur lors de la réservation du cours");
		}
	};

	const cancelCourse = async (idCours, idAdherent) => {
		try {
			const response = await axios.delete(
				`http://127.0.0.1/badminton/src/PHP/cancel-cours.php?idCours=${idCours}&idAdh=${idAdherent}`
			);
			if (response.data.status === "success") {
				message.success(response.data.message);
			} else if (response.data.status === "error") {
				message.error(response.data.message);
			}
		} catch (error) {
			console.error("Erreur lors de la désinscription du cours :", error);
			message.error("Erreur lors de la désinscription du cours");
		}
	};

	const getListData = (value) => {
		const date = value.format("ddd MMM DD YYYY");
		return courseData[date] || [];
	};

	const dateCellRender = (value) => {
		const listData = getListData(value);
		return (
			<ul className="events">
				{listData?.map((item) => (
					<Badge key={item.id} status={item.type} text={item.cours} />
				))}
			</ul>
		);
	};

	const cellRender = (current, info) => {
		if (info.type === "date") return dateCellRender(current);
		if (info.type === "month") return <div>EMPTY</div>;
	};

	const onDateSelect = (value) => {
		const date = value.format("ddd MMM DD YYYY");
		const newData = courseData[date] || [];
		if (newData?.length > 0) {
			setModalData(newData);
			setIsModalOpened(true);
		}
	};

	const handleOk = () => {
		setIsModalOpened(false);
	};

	const handleCancel = () => {
		setIsModalOpened(false);
	};

	return (
		<div style={{ padding: "20px" }}>
			<Calendar cellRender={cellRender} onSelect={onDateSelect} />
			<Modal
				title="Cours du jour"
				open={isModalOpened}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<List>
					<VirtualList
						data={modalData}
						height={ContainerHeight}
						itemHeight={47}
						itemKey="email"
					>
						{(item) => (
							<List.Item key={item.id}>
								<List.Item.Meta
									title={item.cours}
									description={`Professeur:\n${item.prenomProf} ${
										item.nomProf
									}\nInscrits:\n${
										item.registeredMembers
											? item.registeredMembers.join(", ")
											: ""
									}`}
									style={{ whiteSpace: "pre-line" }}
								/>
								<Space>
									<Button
										type="primary"
										onClick={() => reserveCourse(item.id, idAdh)}
									>
										{"Je réserve"}
									</Button>
									<Button onClick={() => cancelCourse(item.id, idAdh)}>
										{"Je me désinscris"}
									</Button>
								</Space>
							</List.Item>
						)}
					</VirtualList>
				</List>
			</Modal>
		</div>
	);
}
