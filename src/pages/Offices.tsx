import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserPlus, Printer } from 'lucide-react';
import { officeAPI } from '../services/api';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

interface Office {
	id: number;
	officeName: string;
	officeDescription?: string;
	checkInLat?: number;
	checkInLng?: number;
	checkInAddress?: string;
	qrCode?: string | null;
	status?: string;
	createdAt?: string;
}

const Offices: React.FC = () => {
	const [offices, setOffices] = useState<Office[]>([]);
	const [filteredOffices, setFilteredOffices] = useState<Office[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingOffice, setEditingOffice] = useState<Office | null>(null);

	useEffect(() => {
		fetchOffices();
	}, []);

	useEffect(() => {
		const filtered = offices.filter(o =>
			o.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(o.checkInAddress || '').toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredOffices(filtered);
	}, [offices, searchTerm]);

	const fetchOffices = async () => {
		try {
			const data = await officeAPI.getAll();
			setOffices(data);
		} catch (error) {
			toast.error('Failed to fetch offices');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!window.confirm('Are you sure you want to delete this office?')) return;
		try {
			await officeAPI.delete(id.toString());
			setOffices(offices.filter(o => o.id !== id));
			toast.success('Office deleted successfully');
		} catch (error) {
			toast.error('Failed to delete office');
		}
	};

	const handleEdit = (office: Office) => {
		setEditingOffice(office);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingOffice(null);
	};

    const handlePrint = (qrCode: string | null | undefined, borderColor: string = 'green') => {
        if (!qrCode) {
            toast.error('No QR code available for this office');
            return;
        }
        const printWindow = window.open('', '', 'width=600,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR Code</title>
                    </head>
                    <body style="text-align: center; margin-top: 30px; border: 20px solid ${borderColor}; padding: 20px">
                        <img src="${qrCode}" alt="QR Code" width="100%" style="margin:0 0 0 0"/>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        } else {
            toast.error('Failed to open print window');
        }
    }

	const handleSave = async (data: Partial<Office>) => {
		try {
			if (editingOffice) {
				const updated = await officeAPI.update(editingOffice.id.toString(), {
					officeName: data.officeName,
					officeDescription: data.officeDescription,
					checkInLat: data.checkInLat,
					checkInLng: data.checkInLng,
					checkInAddress: data.checkInAddress,
				});
				setOffices(offices.map(o => o.id === editingOffice.id ? updated : o));
				toast.success('Office updated');
			} else {
				const created = await officeAPI.create({
					officeName: data.officeName,
					officeDescription: data.officeDescription,
					checkInLat: data.checkInLat,
					checkInLng: data.checkInLng,
					checkInAddress: data.checkInAddress,
				});
				setOffices([created, ...offices]);
				toast.success('Office created');
			}
			handleCloseModal();
		} catch (error) {
			toast.error(editingOffice ? 'Failed to update office' : 'Failed to create office');
		}
	};

	if (isLoading) {
		return (
			<Layout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-2xl font-bold text-gray-900">Offices</h1>
						<p className="mt-1 text-sm text-gray-600">Manage your organization's offices and check-in locations</p>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<button
							type="button"
							onClick={() => setShowModal(true)}
							className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Office
						</button>
					</div>
				</div>

				{/* Search */}
				<div className="max-w-md">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Search offices..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Offices Table */}
				<div className="bg-white shadow overflow-hidden sm:rounded-md">
					{filteredOffices.length === 0 ? (
						<div className="text-center py-12">
							<UserPlus className="mx-auto h-12 w-12 text-gray-400" />
							<h3 className="mt-2 text-sm font-medium text-gray-900">No offices</h3>
							<p className="mt-1 text-sm text-gray-500">Create a new office to enable check-in locations.</p>
							<div className="mt-6">
								<button
									type="button"
									onClick={() => setShowModal(true)}
									className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									<Plus className="w-4 h-4 mr-2" />
									Add Office
								</button>
							</div>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredOffices.map((office) => (
										<tr key={office.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{office.officeName}</div>
												<div className="text-sm text-gray-500">{office.officeDescription || '-'}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{office.checkInAddress || '-'}</td>
											{/* <td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${office.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
													{office.status === 'active' ? 'Active' : 'Inactive'}
												</span>
											</td> */}
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<button onClick={() => handleEdit(office)} className="text-blue-600 hover:text-blue-900" title="Edit">
														<Edit className="w-4 h-4" />
													</button>
													<button onClick={() => handleDelete(office.id)} className="text-red-600 hover:text-red-900" title="Delete">
														<Trash2 className="w-4 h-4" />
													</button>
                                                    <button onClick={() => handlePrint(office.qrCode, "green")} className="text-green-600 hover:text-green-900" title="Print QR Code">
														<Printer className="w-4 h-4" />
													</button>
                                                    <button onClick={() => handlePrint(office.qrCode, "red")} className="text-red-600 hover:text-red-900" title="Print QR Code">
														<Printer className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{/* Create/Edit Modal */}
			{showModal && (
				<OfficeModal
					office={editingOffice}
					onSave={handleSave}
					onClose={handleCloseModal}
				/>
			)}
		</Layout>
	);
};

interface OfficeModalProps {
	office: Office | null;
	onSave: (data: Partial<Office>) => void;
	onClose: () => void;
}

const OfficeModal: React.FC<OfficeModalProps> = ({ office, onSave, onClose }) => {
	const [formData, setFormData] = useState<Partial<Office>>({
		officeName: office?.officeName || '',
		officeDescription: office?.officeDescription || '',
		// checkInLat: office?.checkInLat || 0,
		// checkInLng: office?.checkInLng || 0,
        checkInLat: office?.checkInLat ? parseFloat(String(office.checkInLat)) : 0,
		checkInLng: office?.checkInLng ? parseFloat(String(office.checkInLng)) : 0,
		checkInAddress: office?.checkInAddress || '',
		qrCode: office?.qrCode || '',
		status: office?.status || 'active',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ 
			...prev, 
			[name]: (name === 'checkInLat' || name === 'checkInLng') ? (value ? parseFloat(value) : 0) : value 
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
				<div className="mt-3">
					<h3 className="text-lg font-medium text-gray-900 mb-4">{office ? 'Edit Office' : 'Add New Office'}</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Office Name</label>
							<input name="officeName" value={formData.officeName as string} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Description</label>
							<textarea name="officeDescription" value={formData.officeDescription as string} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Latitude</label>
								<input name="checkInLat" type="number" value={formData.checkInLat as number} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Longitude</label>
								<input name="checkInLng" type="number" value={formData.checkInLng as number} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Address</label>
							<input name="checkInAddress" value={formData.checkInAddress as string} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
						</div>
					{office && (
						<div>
							<label className="block text-sm font-medium text-gray-700">QR Code</label>
							<input name="qrCode" value={formData.qrCode as string || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
							{formData.qrCode && (
								<img src={formData.qrCode as string} alt="QR Code" className="mt-2 h-64 w-64"/>
							)}
						</div>
					)}
						{/* <div>
							<label className="block text-sm font-medium text-gray-700">Status</label>
							<select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div> */}
						<div className="flex justify-end space-x-3 pt-4">
							<button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
							<button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{office ? 'Update' : 'Create'}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Offices;