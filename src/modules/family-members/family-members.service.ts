import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FamilyMember } from './family-member.entity';
import { FamilyMemberPersonalDetail } from './family-member-personal-detail.entity';
import { FamilyMemberHealthDetail } from './family-member-health-detail.entity';
import { CreateFamilyMemberRequestDto } from './dto/create-family-member.dto';
import { FullCreateFamilyMemberResponse } from './responses/full-create-family-member.response';
import { RelationType } from '../relation-types/relation-type.entity';
import { BloodGroupType } from '../bloodgroup-types/bloodgroup-type.entity';
import { ClothingSizeType } from '../clothingsize-types/clothingsize-type.entity';
import { ShoesizeType } from '../shoesize-types/shoesize-type.entity';

@Injectable()
export class FamilyMembersService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(FamilyMember)
        private readonly familyMemberRepo: Repository<FamilyMember>,
        @InjectRepository(FamilyMemberPersonalDetail)
        private readonly personalDetailRepo: Repository<FamilyMemberPersonalDetail>,
        @InjectRepository(FamilyMemberHealthDetail)
        private readonly healthDetailRepo: Repository<FamilyMemberHealthDetail>,
    ) {}

    // Create initial family member for a user.
    // Defaults to relation type 'Self' and marks as family head unless specified.
    async create_for_user(
        params: {
            created_by: string;
            first_name?: string | null;
            last_name?: string | null;
            is_family_head?: boolean;
        },
        manager?: EntityManager,
    ): Promise<void> {
        const {
            created_by,
            first_name = null,
            last_name = null,
            is_family_head = true,
        } = params;

        const runner = manager ?? this.dataSource.manager;

        // lookup relation_type_id for 'Self'
        const relRow = await runner
            .createQueryBuilder()
            .select(['rt.id as relation_type_id'])
            .from('relation_types', 'rt')
            .where('rt.name = :name', { name: 'Self' })
            .andWhere('rt.is_active = :active', { active: true })
            .limit(1)
            .getRawOne<{ relation_type_id: string }>();

        if (!relRow?.relation_type_id) {
            throw new Error('Relation type \'Self\' not found or inactive');
        }
        const insertRes = await runner
            .createQueryBuilder()
            .insert()
            .into('family_members', [
                'created_by',
                'relation_type_id',
                'first_name',
                'last_name',
                'is_family_head',
            ])
            .values([
                {
                    created_by,
                    relation_type_id: relRow.relation_type_id,
                    first_name,
                    last_name,
                    is_family_head,
                },
            ])
            .returning(['id'])
            .execute();

        const memberId: string | undefined = insertRes.identifiers?.[0]?.id ?? insertRes.raw?.[0]?.id;

        if (memberId) {
            // insert blank personal detail row with only family_member_id
            await runner
                .createQueryBuilder()
                .insert()
                .into('family_member_personal_details', ['family_member_id'])
                .values({ family_member_id: memberId })
                .execute();

            // insert blank health detail row with only family_member_id (health_date default handled by DB)
            await runner
                .createQueryBuilder()
                .insert()
                .into('family_member_health_details', ['family_member_id'])
                .values({ family_member_id: memberId })
                .execute();
        }
    }

    // Update member and its single personal/health details for the logged-in user
    async updateForUser(
        user_id: string,
        member_id: string,
        payload: {
            member?: Partial<FamilyMember>;
            personal_detail?: Partial<FamilyMemberPersonalDetail>;
            health_detail?: Partial<FamilyMemberHealthDetail>;
        },
    ): Promise<FullCreateFamilyMemberResponse> {
        return this.dataSource.transaction(async (trx) => {
            const memberRepo = trx.getRepository(FamilyMember);
            const personalRepo = trx.getRepository(FamilyMemberPersonalDetail);
            const healthRepo = trx.getRepository(FamilyMemberHealthDetail);

            // ensure ownership
            const existing = await memberRepo.findOne({ where: { id: member_id, created_by: user_id } });
            if (!existing) throw new NotFoundException('Family member not found or does not belong to current user');

            // update member
            if (payload.member && Object.keys(payload.member).length) {
                await memberRepo.update({ id: member_id }, {
                    first_name: payload.member.first_name ?? existing.first_name ?? null,
                    last_name: payload.member.last_name ?? existing.last_name ?? null,
                    relation_type_id: payload.member.relation_type_id ?? existing.relation_type_id,
                });
            }

            // update or insert personal_detail (single row per member)
            if (payload.personal_detail) {
                const currentPd = await personalRepo.findOne({ where: { family_member_id: member_id } });
                if (currentPd) {
                    await personalRepo.update({ id: currentPd.id }, {
                        dob: payload.personal_detail.dob ?? currentPd.dob ?? null,
                        gender: (payload.personal_detail as any).gender ?? (currentPd as any).gender ?? null,
                        height: payload.personal_detail.height ?? currentPd.height ?? null,
                        weight: payload.personal_detail.weight ?? currentPd.weight ?? null,
                        blood_group_id: payload.personal_detail.blood_group_id ?? currentPd.blood_group_id ?? null,
                        upper_clothing_size_id: payload.personal_detail.upper_clothing_size_id ?? currentPd.upper_clothing_size_id ?? null,
                        lower_clothing_size_id: payload.personal_detail.lower_clothing_size_id ?? currentPd.lower_clothing_size_id ?? null,
                        shoes_size_id: payload.personal_detail.shoes_size_id ?? currentPd.shoes_size_id ?? null,
                    });
                } else {
                    await personalRepo.insert({
                        family_member_id: member_id,
                        dob: payload.personal_detail.dob ?? null,
                        gender: (payload.personal_detail as any).gender ?? null,
                        height: payload.personal_detail.height ?? null,
                        weight: payload.personal_detail.weight ?? null,
                        blood_group_id: payload.personal_detail.blood_group_id ?? null,
                        upper_clothing_size_id: payload.personal_detail.upper_clothing_size_id ?? null,
                        lower_clothing_size_id: payload.personal_detail.lower_clothing_size_id ?? null,
                        shoes_size_id: payload.personal_detail.shoes_size_id ?? null,
                    });
                }
            }

            // update or insert health_detail (single row per member)
            if (payload.health_detail) {
                const currentHd = await healthRepo.findOne({ where: { family_member_id: member_id } });
                if (currentHd) {
                    await healthRepo.update({ id: currentHd.id }, {
                        health_date: payload.health_detail.health_date ?? currentHd.health_date,
                        blood_pressure_systolic: payload.health_detail.blood_pressure_systolic ?? currentHd.blood_pressure_systolic ?? null,
                        blood_pressure_diastolic: payload.health_detail.blood_pressure_diastolic ?? currentHd.blood_pressure_diastolic ?? null,
                        heart_rate: payload.health_detail.heart_rate ?? currentHd.heart_rate ?? null,
                        temperature: (payload.health_detail as any).temperature ?? (currentHd as any).temperature ?? null,
                        blood_sugar: (payload.health_detail as any).blood_sugar ?? (currentHd as any).blood_sugar ?? null,
                        cholesterol: (payload.health_detail as any).cholesterol ?? (currentHd as any).cholesterol ?? null,
                        symptoms: payload.health_detail.symptoms ?? currentHd.symptoms ?? null,
                        medications: payload.health_detail.medications ?? currentHd.medications ?? null,
                        allergies: payload.health_detail.allergies ?? currentHd.allergies ?? null,
                        medical_conditions: payload.health_detail.medical_conditions ?? currentHd.medical_conditions ?? null,
                        notes: payload.health_detail.notes ?? currentHd.notes ?? null,
                    });
                } else {
                    await healthRepo.insert({
                        family_member_id: member_id,
                        health_date: payload.health_detail.health_date,
                        blood_pressure_systolic: payload.health_detail.blood_pressure_systolic ?? null,
                        blood_pressure_diastolic: payload.health_detail.blood_pressure_diastolic ?? null,
                        heart_rate: payload.health_detail.heart_rate ?? null,
                        temperature: (payload.health_detail as any).temperature ?? null,
                        blood_sugar: (payload.health_detail as any).blood_sugar ?? null,
                        cholesterol: (payload.health_detail as any).cholesterol ?? null,
                        symptoms: payload.health_detail.symptoms ?? null,
                        medications: payload.health_detail.medications ?? null,
                        allergies: payload.health_detail.allergies ?? null,
                        medical_conditions: payload.health_detail.medical_conditions ?? null,
                        notes: payload.health_detail.notes ?? null,
                    });
                }
            }

            // reload enriched response
            const memberWithRel = await memberRepo.findOne({ where: { id: member_id }, relations: { relation_type: true } });
            const personalWithRel = await personalRepo.findOne({
                where: { family_member_id: member_id },
                relations: {
                    blood_group: true,
                    upper_clothing_size: true,
                    lower_clothing_size: true,
                    shoes_size: true,
                },
            });
            const healthWith = await healthRepo.findOne({ where: { family_member_id: member_id } });

            const toMini = (obj: any) => (obj ? { id: obj.id, name: obj.name } : null);

            return {
                member: {
                    id: memberWithRel!.id,
                    created_by: memberWithRel!.created_by,
                    relation_type_id: memberWithRel!.relation_type_id,
                    first_name: memberWithRel!.first_name ?? null,
                    last_name: memberWithRel!.last_name ?? null,
                    is_family_head: memberWithRel!.is_family_head,
                    created_at: memberWithRel!.created_at,
                    updated_at: memberWithRel!.updated_at,
                    deleted_at: memberWithRel!.deleted_at ?? null,
                    relation_type: memberWithRel!.relation_type ? toMini(memberWithRel!.relation_type) : null,
                },
                personal_detail: personalWithRel
                    ? {
                          id: personalWithRel.id,
                          family_member_id: personalWithRel.family_member_id,
                          dob: personalWithRel.dob ?? null,
                          gender: (personalWithRel as any).gender ?? null,
                          height: personalWithRel.height ?? null,
                          weight: personalWithRel.weight ?? null,
                          blood_group_id: personalWithRel.blood_group_id ?? null,
                          upper_clothing_size_id: personalWithRel.upper_clothing_size_id ?? null,
                          lower_clothing_size_id: personalWithRel.lower_clothing_size_id ?? null,
                          shoes_size_id: personalWithRel.shoes_size_id ?? null,
                          created_at: personalWithRel.created_at,
                          updated_at: personalWithRel.updated_at,
                          deleted_at: personalWithRel.deleted_at ?? null,
                          blood_group: toMini((personalWithRel as any).blood_group),
                          upper_clothing_size: toMini((personalWithRel as any).upper_clothing_size),
                          lower_clothing_size: toMini((personalWithRel as any).lower_clothing_size),
                          shoes_size: toMini((personalWithRel as any).shoes_size),
                      }
                    : null,
                health_detail: healthWith
                    ? {
                          id: healthWith.id,
                          family_member_id: healthWith.family_member_id,
                          health_date: healthWith.health_date,
                          blood_pressure_systolic: healthWith.blood_pressure_systolic ?? null,
                          blood_pressure_diastolic: healthWith.blood_pressure_diastolic ?? null,
                          heart_rate: healthWith.heart_rate ?? null,
                          temperature: (healthWith as any).temperature ?? null,
                          blood_sugar: (healthWith as any).blood_sugar ?? null,
                          cholesterol: (healthWith as any).cholesterol ?? null,
                          symptoms: healthWith.symptoms ?? null,
                          medications: healthWith.medications ?? null,
                          allergies: healthWith.allergies ?? null,
                          medical_conditions: healthWith.medical_conditions ?? null,
                          notes: healthWith.notes ?? null,
                          created_at: healthWith.created_at,
                          updated_at: healthWith.updated_at,
                          deleted_at: healthWith.deleted_at ?? null,
                      }
                    : null,
            } as FullCreateFamilyMemberResponse;
        });
    }

    // Soft delete a member and its details (sets deleted_at)
    async softDeleteForUser(user_id: string, member_id: string): Promise<{ id: string; deleted_at: Date }> {
        return this.dataSource.transaction(async (trx) => {
            const memberRepo = trx.getRepository(FamilyMember);
            const personalRepo = trx.getRepository(FamilyMemberPersonalDetail);
            const healthRepo = trx.getRepository(FamilyMemberHealthDetail);

            const existing = await memberRepo.findOne({
                where: { id: member_id, created_by: user_id },
                relations: { relation_type: true },
            });
            if (!existing) throw new NotFoundException('Family member not found or does not belong to current user');
            const relName = (existing as any).relation_type?.name;
            if (relName === 'Self') {
                throw new BadRequestException("You can't delete self account");
            }

            const now = new Date();

            await personalRepo
                .createQueryBuilder()
                .update()
                .set({ deleted_at: now as any })
                .where('family_member_id = :id', { id: member_id })
                .andWhere('deleted_at IS NULL')
                .execute();

            await healthRepo
                .createQueryBuilder()
                .update()
                .set({ deleted_at: now as any })
                .where('family_member_id = :id', { id: member_id })
                .andWhere('deleted_at IS NULL')
                .execute();

            await memberRepo
                .createQueryBuilder()
                .update()
                .set({ deleted_at: now as any })
                .where('id = :id', { id: member_id })
                .andWhere('deleted_at IS NULL')
                .execute();

            return { id: member_id, deleted_at: now };
        });
    }
    // List all family members for the logged-in user (no pagination)
    async listForUser(user_id: string): Promise<FullCreateFamilyMemberResponse[]> {
        const members = await this.familyMemberRepo.find({
            where: { created_by: user_id },
            relations: { relation_type: true },
            order: { created_at: 'DESC' },
        });

        if (!members.length) return [];

        const ids = members.map((m) => m.id);

        const personal = await this.personalDetailRepo.find({
            where: ids.map((id) => ({ family_member_id: id })),
            relations: {
                blood_group: true,
                upper_clothing_size: true,
                lower_clothing_size: true,
                shoes_size: true,
            },
            order: { created_at: 'DESC' },
        });

        const health = await this.healthDetailRepo.find({
            where: ids.map((id) => ({ family_member_id: id })),
            order: { created_at: 'DESC' },
        });

        // Group details by family_member_id for quick lookup
        const pdMap = new Map<string, FamilyMemberPersonalDetail[]>();
        for (const pd of personal) {
            const list = pdMap.get(pd.family_member_id) ?? [];
            list.push(pd);
            pdMap.set(pd.family_member_id, list);
        }

        const hdMap = new Map<string, FamilyMemberHealthDetail[]>();
        for (const hd of health) {
            const list = hdMap.get(hd.family_member_id) ?? [];
            list.push(hd);
            hdMap.set(hd.family_member_id, list);
        }

        const toMini = (obj: any) => (obj ? { id: obj.id, name: obj.name } : null);

        return members.map((m) => ({
            member: {
                id: m.id,
                created_by: m.created_by,
                relation_type_id: m.relation_type_id,
                first_name: m.first_name ?? null,
                last_name: m.last_name ?? null,
                is_family_head: m.is_family_head,
                created_at: m.created_at,
                updated_at: m.updated_at,
                deleted_at: m.deleted_at ?? null,
                relation_type: toMini(m.relation_type),
            },
            personal_detail: ((): any => {
                const pdArr = pdMap.get(m.id) ?? [];
                const pd = pdArr[0];
                if (!pd) return null;
                return {
                    id: pd.id,
                    family_member_id: pd.family_member_id,
                    dob: pd.dob ?? null,
                    gender: (pd as any).gender ?? null,
                    height: pd.height ?? null,
                    weight: pd.weight ?? null,
                    blood_group_id: pd.blood_group_id ?? null,
                    upper_clothing_size_id: pd.upper_clothing_size_id ?? null,
                    lower_clothing_size_id: pd.lower_clothing_size_id ?? null,
                    shoes_size_id: pd.shoes_size_id ?? null,
                    created_at: pd.created_at,
                    updated_at: pd.updated_at,
                    deleted_at: pd.deleted_at ?? null,
                    blood_group: toMini(pd.blood_group),
                    upper_clothing_size: toMini(pd.upper_clothing_size),
                    lower_clothing_size: toMini(pd.lower_clothing_size),
                    shoes_size: toMini(pd.shoes_size),
                };
            })(),
            health_detail: ((): any => {
                const hdArr = hdMap.get(m.id) ?? [];
                const hd = hdArr[0];
                if (!hd) return null;
                return {
                    id: hd.id,
                    family_member_id: hd.family_member_id,
                    health_date: hd.health_date,
                    blood_pressure_systolic: hd.blood_pressure_systolic ?? null,
                    blood_pressure_diastolic: hd.blood_pressure_diastolic ?? null,
                    heart_rate: hd.heart_rate ?? null,
                    temperature: (hd as any).temperature ?? null,
                    blood_sugar: (hd as any).blood_sugar ?? null,
                    cholesterol: (hd as any).cholesterol ?? null,
                    symptoms: hd.symptoms ?? null,
                    medications: hd.medications ?? null,
                    allergies: hd.allergies ?? null,
                    medical_conditions: hd.medical_conditions ?? null,
                    notes: hd.notes ?? null,
                    created_at: hd.created_at,
                    updated_at: hd.updated_at,
                    deleted_at: hd.deleted_at ?? null,
                };
            })(),
        }));
    }

    // Create member with optional personal and health details in a transaction
    async create(
        user_id: string,
        payload: CreateFamilyMemberRequestDto,
    ): Promise<FullCreateFamilyMemberResponse> {
        return this.dataSource.transaction(async (trx) => {
            const memberRepo = trx.getRepository(FamilyMember);
            const personalRepo = trx.getRepository(FamilyMemberPersonalDetail);
            const healthRepo = trx.getRepository(FamilyMemberHealthDetail);
            // Create member
            const memberEntity = memberRepo.create({
                created_by: user_id,
                relation_type_id: payload.member.relation_type_id,
                first_name: payload.member.first_name ?? null,
                last_name: payload.member.last_name ?? null,
                is_family_head: false,
            });
            const savedMember = await memberRepo.save(memberEntity);

            // Optional personal details
            let personal_details: FamilyMemberPersonalDetail[] = [];
            if (payload.personal_details?.length) {
                const pdEntities = payload.personal_details.map((pd) =>
                    personalRepo.create({
                        family_member_id: savedMember.id,
                        dob: pd.dob ?? null,
                        gender: pd.gender ?? null,
                        height: pd.height ?? null,
                        weight: pd.weight ?? null,
                        blood_group_id: pd.blood_group_id ?? null,
                        upper_clothing_size_id: pd.upper_clothing_size_id ?? null,
                        lower_clothing_size_id: pd.lower_clothing_size_id ?? null,
                        shoes_size_id: pd.shoes_size_id ?? null,
                    }),
                );
                personal_details = await personalRepo.save(pdEntities);
            }

            // Optional health details
            let health_details: FamilyMemberHealthDetail[] = [];
            if (payload.health_details?.length) {
                const hdEntities = payload.health_details.map((hd) =>
                    healthRepo.create({
                        family_member_id: savedMember.id,
                        health_date: hd.health_date ?? undefined,
                        blood_pressure_systolic: hd.blood_pressure_systolic ?? null,
                        blood_pressure_diastolic: hd.blood_pressure_diastolic ?? null,
                        heart_rate: hd.heart_rate ?? null,
                        temperature: hd.temperature ?? null,
                        blood_sugar: hd.blood_sugar ?? null,
                        cholesterol: hd.cholesterol ?? null,
                        symptoms: hd.symptoms ?? null,
                        medications: hd.medications ?? null,
                        allergies: hd.allergies ?? null,
                        medical_conditions: hd.medical_conditions ?? null,
                        notes: hd.notes ?? null,
                    }),
                );
                health_details = await healthRepo.save(hdEntities);
            }

            // Reload with relations
            const memberWithRel = await memberRepo.findOne({
                where: { id: savedMember.id },
                relations: { relation_type: true },
            });

            const personalWithRels = await personalRepo.find({
                where: { family_member_id: savedMember.id },
                relations: {
                    blood_group: true,
                    upper_clothing_size: true,
                    lower_clothing_size: true,
                    shoes_size: true,
                },
            });

            // Reload health details to ensure DB defaults (e.g., health_date) are present
            const healthWith = await healthRepo.find({ where: { family_member_id: savedMember.id } });

            const result: FullCreateFamilyMemberResponse = {
                member: {
                    id: memberWithRel!.id,
                    created_by: memberWithRel!.created_by,
                    relation_type_id: memberWithRel!.relation_type_id,
                    first_name: memberWithRel!.first_name ?? null,
                    last_name: memberWithRel!.last_name ?? null,
                    is_family_head: memberWithRel!.is_family_head,
                    created_at: memberWithRel!.created_at,
                    updated_at: memberWithRel!.updated_at,
                    deleted_at: memberWithRel!.deleted_at ?? null,
                    relation_type: memberWithRel!.relation_type
                        ? { id: (memberWithRel!.relation_type as RelationType).id, name: (memberWithRel!.relation_type as RelationType).name }
                        : null,
                },
                personal_detail: ((): any => {
                    const pd = personalWithRels[0];
                    if (!pd) return null;
                    return {
                        id: pd.id,
                        family_member_id: pd.family_member_id,
                        dob: pd.dob ?? null,
                        gender: (pd as any).gender ?? null,
                        height: pd.height ?? null,
                        weight: pd.weight ?? null,
                        blood_group_id: pd.blood_group_id ?? null,
                        upper_clothing_size_id: pd.upper_clothing_size_id ?? null,
                        lower_clothing_size_id: pd.lower_clothing_size_id ?? null,
                        shoes_size_id: pd.shoes_size_id ?? null,
                        created_at: pd.created_at,
                        updated_at: pd.updated_at,
                        deleted_at: pd.deleted_at ?? null,
                        blood_group: pd.blood_group
                            ? { id: (pd.blood_group as BloodGroupType).id, name: (pd.blood_group as BloodGroupType).name }
                            : null,
                        upper_clothing_size: pd.upper_clothing_size
                            ? { id: (pd.upper_clothing_size as ClothingSizeType).id, name: (pd.upper_clothing_size as ClothingSizeType).name }
                            : null,
                        lower_clothing_size: pd.lower_clothing_size
                            ? { id: (pd.lower_clothing_size as ClothingSizeType).id, name: (pd.lower_clothing_size as ClothingSizeType).name }
                            : null,
                        shoes_size: pd.shoes_size
                            ? { id: (pd.shoes_size as ShoesizeType).id, name: (pd.shoes_size as ShoesizeType).name }
                            : null,
                    };
                })(),
                health_detail: ((): any => {
                    const hd = healthWith[0];
                    if (!hd) return null;
                    return {
                        id: hd.id,
                        family_member_id: hd.family_member_id,
                        health_date: hd.health_date,
                        blood_pressure_systolic: hd.blood_pressure_systolic ?? null,
                        blood_pressure_diastolic: hd.blood_pressure_diastolic ?? null,
                        heart_rate: hd.heart_rate ?? null,
                        temperature: (hd as any).temperature ?? null,
                        blood_sugar: (hd as any).blood_sugar ?? null,
                        cholesterol: (hd as any).cholesterol ?? null,
                        symptoms: hd.symptoms ?? null,
                        medications: hd.medications ?? null,
                        allergies: hd.allergies ?? null,
                        medical_conditions: hd.medical_conditions ?? null,
                        notes: hd.notes ?? null,
                        created_at: hd.created_at,
                        updated_at: hd.updated_at,
                        deleted_at: hd.deleted_at ?? null,
                    };
                })(),
            };

            return result;
        });
    }
}
