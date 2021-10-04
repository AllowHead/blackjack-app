import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Container, Modal, Nav, Navbar, NavbarBrand } from 'react-bootstrap';

const PageHeader = (props) => {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
    const moveToHelp = () => {
        router.push('/help');
    }
    return (
        <header>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static">
                <Modal.Header >
                    <Modal.Title>あそびかたのページへ移動します。</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    現在進行中のゲームは保存されませんがよろしいですか？
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        閉じる
                    </Button>
                    <Button variant="primary" onClick={moveToHelp}>移動する</Button>
                </Modal.Footer>
            </Modal>

            <Navbar fixed='sticky-top' bg='dark' variant='dark'>
                <Container>
                    <Link href='/' passHref>
                        <NavbarBrand>
                            <div>
                                ブラックジャック
                            </div>
                        </NavbarBrand>
                    </Link>
                    <Nav>
                        <Nav.Link>
                            <div variant="primary" onClick={handleShow}>
                                あそびかた
                            </div>
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    )
}

export default PageHeader;