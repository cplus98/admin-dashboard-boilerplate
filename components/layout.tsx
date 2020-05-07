import _ from 'lodash';
import React, { Component, useState, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import Router, { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Container, Link, Menu, MenuItem } from '@material-ui/core';
import { useAuth } from '@utils/auth';
import { SvgLogo, SvgArrowDown } from '@res/svg';

const StyledButton = styled(Button)`
	&& {
		color: inherit;
		margin-left: 30px;
	}
`;

export default ({ children }: any) => {
	const { auth, logIn, logOut } = useAuth();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const rightElements = (
		<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15 }}>
			<div
				style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
				onClick={(event: any) => {
					handleClick(event);
				}}>
				<div style={{ display: 'flex', flexDirection: 'column', marginRight: 10 }}>
					<span style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 1, textAlign: 'right' }}>ID</span>
					<span style={{ color: 'gray', fontSize: 16, lineHeight: 1, textAlign: 'right' }}>Admin</span>
				</div>
				<SvgArrowDown style={{ width: 12, height: 12, marginTop: 2, marginRight: 10 }} />
			</div>
			<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem
					onClick={() => {
						Router.push('/profile');
						handleClose();
					}}>
					Profile
				</MenuItem>
				<MenuItem
					onClick={() => {
						logOut();
						handleClose();
					}}>
					Log out
				</MenuItem>
			</Menu>
		</div>
	);

	const router = useRouter();
	const { route } = router;

	return (
		<section>
			<div style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #d0d0d0', display: 'flex', flexDirection: 'row', alignItems: 'stretch', paddingTop: 10, paddingBottom: 10 }}>
				<div
					style={{ marginLeft: 30, display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
					onClick={(event) => {
						Router.push('/');
					}}>
					<SvgLogo style={{ width: 20, height: 20, marginRight: 5 }} />
					<span>SerivceName</span>
				</div>
				<div>
					<StyledButton
						onClick={() => {
							console.log('user');
							Router.push('/users');
						}}>
						Users
					</StyledButton>
					<StyledButton
						onClick={() => {
							Router.push('/boards');
						}}>
						Boards
					</StyledButton>
					<StyledButton
						onClick={() => {
							Router.push('/settings');
						}}>
						Settings
					</StyledButton>
				</div>
				{rightElements}
			</div>
			<Container>{children}</Container>
		</section>
	);
};
