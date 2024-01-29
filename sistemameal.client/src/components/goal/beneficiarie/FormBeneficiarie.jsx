import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { GrFormPreviousLink } from "react-icons/gr";
import DonutChart from "../../reusable/DonutChart";

const FormBeneficiarie = () => {
    const navigate = useNavigate();
    const { id: encodedCiphertext } = useParams();
    // Decodifica la cadena cifrada
    const ciphertext = decodeURIComponent(encodedCiphertext);
    // Desencripta el ID
    const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const metAno = id.slice(0, 4);
    const metCod = id.slice(4);
    console.log(metAno);
    console.log(metCod);


    return (
        <div className="bg-white h-100 flex flex-column">
            <div className="PowerMas_Header_Form_Beneficiarie flex ai-center p_25">
                <GrFormPreviousLink className="m1 w-auto Large-f2_5 pointer" onClick={() => navigate('/monitoring')} />
                <h1 className="">Nuevo Beneficiario</h1>
            </div>
            <div className="PowerMas_Content_Form_Beneficiarie overflow-auto flex-grow-1 flex">
                    <div className="Large_6 m1 overflow-auto">
                        <h2>Datos Personales</h2>
                        <form className="Large-p_75">
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Tipo de documento:
                                </label>
                                <select name="" id="" className="block Phone_12">
                                    <option value="">Tipo de documento</option>
                                </select>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Numero de documento:
                                </label>
                                <input type="text" className="block Phone_12" placeholder="74301932" />
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Nombre
                                </label>
                                <input type="text" className="block Phone_12" placeholder="Enzo Fabricio"/>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Apellido
                                </label>
                                <input type="text" className="block Phone_12" placeholder="Gago Aguirre" />
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Genero:
                                </label>
                                <div className="flex gap-1">
                                    <div className="gap_5">
                                        <input type="radio" id="opcion1" name="opciones" value="opcion1" />
                                        <label htmlFor="opcion1">Masculino</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="opcion2" name="opciones" value="opcion2" />
                                        <label htmlFor="opcion2">Femenino</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="opcion3" name="opciones" value="opcion3" />
                                        <label htmlFor="opcion3">Otro</label>
                                    </div>
                                </div>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Fecha de nacimiento:
                                </label>
                                <input type="text" className="block Phone_12" placeholder="ddMMyyy" />
                            </div>
                            {/* Duplicado */}
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Tipo de documento:
                                </label>
                                <select name="" id="" className="block Phone_12">
                                    <option value="">Tipo de documento</option>
                                </select>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Numero de documento:
                                </label>
                                <input type="text" className="block Phone_12" placeholder="74301932" />
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Nombre
                                </label>
                                <input type="text" className="block Phone_12" placeholder="Enzo Fabricio"/>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Apellido
                                </label>
                                <input type="text" className="block Phone_12" placeholder="Gago Aguirre" />
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Genero:
                                </label>
                                <div className="flex gap-1">
                                    <div className="gap_5">
                                        <input type="radio" id="opcion1" name="opciones" value="opcion1" />
                                        <label htmlFor="opcion1">Masculino</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="opcion2" name="opciones" value="opcion2" />
                                        <label htmlFor="opcion2">Femenino</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="opcion3" name="opciones" value="opcion3" />
                                        <label htmlFor="opcion3">Otro</label>
                                    </div>
                                </div>
                            </div>
                            <div className="m_75">
                                <label htmlFor="" className="">
                                    Fecha de nacimiento:
                                </label>
                                <input type="text" className="block Phone_12" placeholder="ddMMyyy" />
                            </div>
                        </form>
                    </div>
                    <div className="PowerMas_Info_Form_Beneficiarie Large_6 m1 p1 overflow-auto">
                        <div className="flex ai-center gap_5">
                            <p className="p_5 Phone_4">Meta: <span>1000</span></p>
                            <p className="p_5 Phone_4">Ejecucion: <span>1000</span></p>
                            <p className="p_5 Phone_4">Saldo: <span>1000</span></p>
                        </div>
                        <br />
                        <div className="PowerMas_Info_Form_Beneficiarie_Progress flex ai-center jc-space-around p1">
                            <h2 className="Large-f2 Large_8 Medium_8">Nos encontramos en un Avance de:</h2>
                            <DonutChart percentage={60} />
                        </div>
                        <br />
                        <div>
                            <article>
                                <h3 className="Large-f1_25 m_5">Proyecto</h3>
                                <p className="m_5">Reponer problemas alimenticios</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Subproyecto</h3>
                                <p className="m_5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Objetivo</h3>
                                <p className="m_5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Resultado</h3>
                                <p className="m_5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.</p>
                            </article>
                            <article>
                                <h3 className="Large-f1_25 m_5">Actividad</h3>
                                <p className="m_5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer.</p>
                            </article>
                        </div>
                    </div>
            </div>
            <div className="PowerMas_Buttoms_Form_Beneficiarie flex ai-center jc-center">
                <button className="Large_5 m2">Guardar</button>
                <button className="Large_5 m2">Eliminar Todo</button>
            </div>
        </div>
    )
}

export default FormBeneficiarie