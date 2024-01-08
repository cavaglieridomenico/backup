import React, { useState, useEffect } from "react";
import HotpointModels from './json/hotpointModels.json';
import IndesitModels from './json/indesitModels.json';

import styles from "./styles.css";

const ModelsCategory = () => {
    const [nomeSottoCategoria, setNomeSottoCategoria] = useState("");
    const [brand, setBrand] = useState("");
    useEffect(() => {
        let url = window && window.location ? window.location.href : "";
        if (url) {
            setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
        }
    }, [])


    let hotpointModels: any = HotpointModels;
    let indesitModels: any = IndesitModels;



    const showMore = (nome: any) => {
        setNomeSottoCategoria(nome)
        console.log(nome)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };

    /*
    
    
    const [data, setData] = useState([]);
    useEffect(() => {

        //need to do the correct number at the property nameLink 
        models.forEach((c: any) => {
            let sottoCategorie = c.sottoCategorie;
            sottoCategorie.forEach((sc: any) => {
                let i = 1
                let links = sc.links;
                links.forEach((l: any) => {
                    let pos = l["nomeLink"].indexOf(".")
                    let nomeLink = l.nomeLink;
                    let nome = nomeLink.slice(pos)
                    l["nomeLink"] = i + nome;
                    i = i + 1;
                })
            })
            
        });
        console.log(models);
        setData(models)
        //need to match the old json with new url link
            categories.forEach((c: any) => {
                let sottoCategorie = c.sottoCategorie;
                sottoCategorie.forEach((sc: any) => {
                    let links = sc.links;
                    links.forEach((l: any) => {
                        let url = l.urlLink;
                        let split = url.split("/category/model_");
                        let model = split[1];
                        products.forEach((p: any) => {
                            if (p.GR33003TPE === model) {
                                if (l.urlLink.includes("/category/model_")) {
                                    l.urlLink = "/" + p.GR33003TPE__1 + "-" + p[`${51082190000}`] + "/p";
                                    setData(categories)
                                } else {
                                    let partial = l.urlLink.substring(0, l.urlLink.indexOf(p.GR33003TPE__1) + p.GR33003TPE__1.length);
                                    let link = {
                                        "nomeLink": l.nomeLink + "-" + p[`${51082190000}`] ,
                                        "urlLink": partial + "-" + p[`${51082190000}`] + "/p"
                                    }
                                    links.push(link);
                                    setData(categories)
                                } 
                            } 
                        })
                        
                    })
                })
                console.log(categories)
            })
    
    }, [])
    */


    return (
        <div>
        {(brand === "hotpoint" ?
            hotpointModels.map((c: any) => {
                return (
                    <div className={styles.modelsCategoryWrapper}>
                        <div className={styles.modelsCategoryTitle}>{c.nomeCategoria}</div>
                        {c.sottoCategorie.map((s: any, index: any) => {
                            return (
                                <div key={index + 1} className={styles.modelsCategorySecondaryWrapper}>
                                    <div className={styles.modelsCategorySecondaryTitle}>{s.nomeSottoCategoria}</div>
                                    <div className={(nomeSottoCategoria === s.nomeSottoCategoria ? [styles.modelsCategorySecondary, styles[`findModel_Show`]].join(" ") : styles.modelsCategorySecondary)}>
                                        {
                                            s.links.map((link: any, index: any) => {
                                                return (
                                                    <div key={index + 1} className={styles.modelsCategoryItems}>
                                                        <div>
                                                            <a href={link.urlLink} target="_blank" > {link.nomeLink} </a>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                    <div onClick={() => showMore(s.nomeSottoCategoria)} className={(nomeSottoCategoria === s.nomeSottoCategoria ? styles.findModelButtonHide : styles.modelsCategoryShowMore)}>Show more</div>
                                </div>
                            )
                        })}
                        <div className={styles.modelsCategorySearchNumber} onClick={() => scrollToTop()}>
                            <div>Having trouble finding your model? <u>Search by model number</u></div>
                        </div>
                    </div >
                )
            }) :

            indesitModels.map((c: any) => {
                return (
                    <div className={styles.modelsCategoryWrapper}>
                        <div className={styles.modelsCategoryTitle}>{c.nomeCategoria}</div>
                        {c.sottoCategorie.map((s: any, index: any) => {
                            return (
                                <div key={index + 1} className={styles.modelsCategorySecondaryWrapper}>
                                    <div className={styles.modelsCategorySecondaryTitle}>{s.nomeSottoCategoria}</div>
                                    <div className={(nomeSottoCategoria === s.nomeSottoCategoria ? [styles.modelsCategorySecondary, styles[`findModel_Show`]].join(" ") : styles.modelsCategorySecondary)}>
                                        {
                                            s.links.map((link: any, index: any) => {
                                                return (
                                                    <div key={index + 1} className={styles.modelsCategoryItems}>
                                                        <div>
                                                            <a href={link.urlLink} target="_blank" > {link.nomeLink} </a>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                    <div onClick={() => showMore(s.nomeSottoCategoria)} className={(nomeSottoCategoria === s.nomeSottoCategoria ? styles.findModelButtonHide : styles.modelsCategoryShowMore)}>Show more</div>
                                </div>
                            )
                        })}
                        <div className={styles.modelsCategorySearchNumber} onClick={() => scrollToTop()}>
                            <div>Having trouble finding your model? <u>Search by model number</u></div>
                        </div>
                    </div >
                )
            })
        )}
        </div>
        
    )
}

export default ModelsCategory;