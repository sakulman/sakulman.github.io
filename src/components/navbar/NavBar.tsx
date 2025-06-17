import * as React from 'react';
import Box from '@mui/material/Box';
import { Divider, Grid2 as Grid } from '@mui/material';
import "./NavBar.css"
import { DownloadOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import NavDrawer from './NavDrawer.tsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SelectedWorksOrder } from '../../types/SelectedWorksOrder.ts';
import { createSelectedWorksList } from '../../firebase/firebase.tsx';
import { Project } from '../../types/Project.ts';

type ProjectLabel = { key: string; label: JSX.Element; path: string };
type ProjectYearLabel = { key: string, label: string, children: ProjectLabel[] }

type NavBarProps = { isFixed: boolean };

function NavBar({ isFixed }: NavBarProps) {

    const navigate = useNavigate();

    const navigateToProject = (url: string) => {
        navigate(`/projects/${url}`);
    }

    const navigateToHome = () => {
        navigate('/');
    }

    const [projects, setProjects] = useState<SelectedWorksOrder[]>([]);

    useEffect(() => {
        const getData = async () => {
            const projectDataList: SelectedWorksOrder[] = await createSelectedWorksList();
            setProjects(projectDataList);
        }
        getData();
    }, [])

    const more: MenuProps['items'] = [
        {
            key: 'resume',
            label: (<Space>
                <DownloadOutlined /> Download Resume
            </Space>),
        },
        {
            key: 'portfolio',
            label: (<Space>
                <DownloadOutlined /> Download Portfolio
            </Space>),
        },
        {
            key: 'login',
            label: (<Space onClick={() => {
                navigate('/editor')
            }}>
                <UserOutlined />Login</Space>),


        }
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '2024-1') {
            //navigate
        }
    };

    const getYears = (): ProjectYearLabel[] => {
        const uniqueYears: number[] = [...new Set(projects.map(proj => proj[0]))];

        return uniqueYears.map(year => {
            return {
                key: year.toString(),
                label: year.toString(),
                children: getProjectsForYear(year)
            };
        });
    }

    const getProjectsForYear = (year: number): ProjectLabel[] => {
        const projectsForThisYear: ProjectLabel[] = [];
        for (let i = 0; i < projects.length; i++) {
            if (projects[i][0] === year) {
                projectsForThisYear.push({
                    key: projects[i][3],
                    label: (
                        <a onClick={() => navigateToProject(projects[i][4])}>
                            {projects[i][1]}
                        </a>
                    ),
                    // label: projects[i][1],
                    path: `/projects/${projects[i][4]}`
                });
            }
        }
        return projectsForThisYear;
    }

    const selectedWorks: MenuProps['items'] = projects.length > 0 ? getYears() :
        [
            {
                key: '2024',
                label: '2024',
                children: [
                    {
                        key: '2024-1',
                        label: 'Project 1',
                    },
                    {
                        key: '2024-2',
                        label: 'Project 2',
                    },
                ],
            },
            {
                key: '2',
                label: '2023',
                children: [
                    {
                        key: '2023-1',
                        label: 'Project 1',
                    },
                    {
                        key: '2-2',
                        label: 'Project 2',
                    },
                ],
            },
            {
                key: '3',
                label: '2022',
                children: [
                    {
                        key: '3-1',
                        label: 'Project 1',
                    },
                    {
                        key: '3-2',
                        label: 'Project 2',
                    },
                ],
            },
            {
                type: 'divider',
            },
            {
                key: '4',
                label: 'View All',

            }

        ];

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleMediaChange = (e) => {
            setIsMobile(e.matches);
        };

        // Add the event listener for changes
        mediaQuery.addEventListener('change', handleMediaChange);

        // Clean up event listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleMediaChange);

    }, []);
    return (

        <Box className={isFixed ? 'app-bar-fixed' : 'app-bar-sticky'}>
            <Grid container sx={{ width: '100%' }}>
                <Grid size={{ xs: 1, md: 1, lg: 2 }}></Grid>
                <Grid className='title-box' size={2} >
                    <p className='name'><b>NUTCHAYA<br />SAKULMANKONGSUK</b><br /><em>ARCHITECT</em></p>

                </Grid>
                <Grid size={{ xs: 2, md: 1, lg: 3 }}></Grid>
                <Grid size={{ xs: 4, md: 6, lg: 3 }} >
                    {
                        !isMobile && (

                            <Box className='nav-items' sx={{ display: 'flex' }}>
                                <p className='nav-item' onClick={() => navigateToHome()}>Home</p>
                                <Divider className='nav-divider' orientation="vertical" sx={{ height: '25%' }} />
                                <Dropdown menu={{ items: selectedWorks }}>
                                    
                                        <Space>
                                            <Link className='nav-item' to="/selected-works">Projects<KeyboardArrowDownIcon className='down-arrow' /></Link>
                                        </Space>
                                    {/* </a> */}
                                </Dropdown>
                                <Divider className='nav-divider' orientation="vertical" sx={{ height: '25%' }} />
                                <p className='nav-item'>Contact</p>
                                <Divider className='nav-divider' orientation="vertical" sx={{ height: '25%' }} />
                                <Dropdown menu={{ items: more }}>

                                    <Space>
                                        <Link className='nav-item' to='#'>More<KeyboardArrowDownIcon className='down-arrow' /> </Link>
                                    </Space>

                                </Dropdown>
                            </Box>



                        )
                    }
                </Grid>

                <Grid className="hamburger-container" size={{ xs: 3, md: 1, lg: 2 }}>
                    {
                        isMobile && (
                            // <div className="hamburger" onClick={toggleDrawer}>
                            //     ☰
                            // </div>
                            <NavDrawer></NavDrawer>

                        )
                    }

                    {/* {isDrawerOpen && (
                        // <div className="drawer">
                        //     <nav className="nav-links mobile">
                        //         <a href="#home">Home</a>
                        //         <a href="#about">About</a>
                        //         <a href="#services">Services</a>
                        //         <a href="#contact">Contact</a>
                        //     </nav>
                        // </div>
                        
                    )} */}
                </Grid>
            </Grid>


        </Box>

    );


};

export default NavBar;